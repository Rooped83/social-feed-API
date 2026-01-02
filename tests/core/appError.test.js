import { test, describe, expect} from 'vitest';
 import AppError from '../../src/core/errors/appError.js';

describe('AppError', () => {
  test('sets message, statusCode and code', () => {
    const err = new AppError('Not allowed', 403, 'FORBIDDEN');

    expect(err.message).toBe('Not allowed');
    expect(err.statusCode).toBe(403); 
    expect(err.code).toBe('FORBIDDEN');
  });

  test('is instance of Error', () => {
    const err = new AppError('error', 400, 'BAD_REQUEST');
    expect(err).toBeInstanceOf(Error);
  });
});
