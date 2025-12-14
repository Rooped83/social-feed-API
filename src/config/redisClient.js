import IOredis from 'ioredis';
import { logger } from '../core/logger/logger.js';
 export const redisClient = new IOredis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD || undefined,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
});

// i implemented this for fallback in case redis is not available:
let isAvailable = true;
redisClient.on('error', (err) => {
    isAvailable = false;
    logger.error('Redis connection error:', { message: err.message, stack: err.stack });
});

redisClient.on('connect', () => {
    isAvailable = true;
    logger.info('Redis connected successfully');
});

export { isAvailable };
