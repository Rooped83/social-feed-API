import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redisClient, isAvailable } from '../config/redisClient.js';
import { rateLimiterConfig } from '../config/rateLimiter.js';
import { asyncHandler } from '../core/utils/asyncCatch.js';
import AppError from '../core/errors/appError.js';
import { ERROR_CODES } from '../core/errors/errorCodes.js';
import { logger } from '../core/logger/logger.js';

 // In-memory fallback for rate limiting when Redis is unavailable
const inMemoryBuckets = new Map();
function inMemoryConsume(key, points, durationSeconds) {
  const now = Date.now();
  const windowStart = now - durationSeconds * 1000;
  let entry = inMemoryBuckets.get(key);
  if (!entry || entry.ts < windowStart) {
    entry = { count: 0, ts: now };
  }
  entry.count += 1;
  entry.ts = now;
  inMemoryBuckets.set(key, entry);
  return {
    remainingPoints: Math.max(0, points - entry.count),
    msBeforeNext: Math.max(0, durationSeconds * 1000 - (now - entry.ts)),
    consumedPoints: entry.count,
  };
}
export function dynamicRateLimiter(type = 'anonymous') {
  const selectedConfig = rateLimiterConfig[type] || rateLimiterConfig.anonymous;

  const rl = new RateLimiterRedis({
    storeClient: redisClient,
    points: selectedConfig.points,
    duration: selectedConfig.duration,
    keyPrefix: selectedConfig.keyPrefix,
  });

  return asyncHandler(async (req, res, next) => {
    const identifier = req.user?.id ? `user:${req.user.id}` : `ip:${req.ip}`;
    // if Redis is unavailable thehn degrade gracefully to in-memory limit
    if (!isAvailable) {
      logger.warn('Redis unavailable; using in-memory rate limiter fallback', {
        route: req.originalUrl,
        identifier,
      });

      const fallback = inMemoryConsume(identifier, selectedConfig.points, selectedConfig.duration);
      res.set('X-RateLimit-Limit', String(selectedConfig.points));
      res.set('X-RateLimit-Remaining', String(Math.max(0, fallback.remainingPoints)));
      res.set('X-RateLimit-Reset', String(Math.ceil((Date.now() + fallback.msBeforeNext) / 1000)));

      if (fallback.remainingPoints <= 0) {
        logger.warn('Rate limit exceeded (fallback)', {
          route: req.originalUrl,
          identifier,
          consumed: fallback.consumedPoints,
        });
        res.set('Retry-After', String(Math.ceil(fallback.msBeforeNext / 1000)));
        return next(new AppError(ERROR_CODES.RATE_LIMIT_EXCEEDED.message, ERROR_CODES.RATE_LIMIT_EXCEEDED.statusCode, ERROR_CODES.RATE_LIMIT_EXCEEDED.code));
      }

      return next();
    }

    // Normal (Redis-backed) path
    try {
      const rlRes = await rl.consume(identifier, 1);

      // send rate-limit headers
      res.set('X-RateLimit-Limit', String(selectedConfig.points));
      res.set('X-RateLimit-Remaining', String(Math.max(0, rlRes.remainingPoints)));
      res.set('X-RateLimit-Reset', String(Math.ceil((Date.now() + rlRes.msBeforeNext) / 1000)));

      return next();
    } catch (rej) {
      // The rate-limiter library returns an object when blocked with msBeforeNext
      if (rej && rej.msBeforeNext) {
        const retryAfterSeconds = Math.ceil(rej.msBeforeNext / 1000);
        res.set('Retry-After', String(retryAfterSeconds));
        res.set('X-RateLimit-Limit', String(selectedConfig.points));
        res.set('X-RateLimit-Remaining', '0');
        res.set('X-RateLimit-Reset', String(Math.ceil((Date.now() + rej.msBeforeNext) / 1000)));

        logger.warn('Rate limit exceeded', {
          route: req.originalUrl,
          identifier,
          msBeforeNext: rej.msBeforeNext,
          consumedPoints: rej.consumedPoints,
        });

        return next(new AppError(ERROR_CODES.RATE_LIMIT_EXCEEDED.message, ERROR_CODES.RATE_LIMIT_EXCEEDED.statusCode, ERROR_CODES.RATE_LIMIT_EXCEEDED.code));
      }

      // unexpected internal errors (Redis failures etc.)
      logger.error('Rate limiter internal error', {
        route: req.originalUrl,
        identifier,
        error: rej?.message || String(rej)
      });

      // we return a RATE_LIMIT_UNAVAILABLE error to preserve semantics but allow you to choose otherwise
      return next(new AppError(
        ERROR_CODES.RATE_LIMIT_UNAVAILABLE.message,
         ERROR_CODES.RATE_LIMIT_UNAVAILABLE.statusCode,
          ERROR_CODES.RATE_LIMIT_UNAVAILABLE.code));
    }
  });
}