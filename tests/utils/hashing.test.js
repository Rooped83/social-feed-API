import { describe, it, expect, vi } from 'vitest';
import bcrypt from 'bcryptjs';
import { doHashing, doCompare } from '../../src/core/utils/hashing.js';

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

describe('doHashing', () => {
  it('hashes the value using bcrypt', async () => {
    const value = 'testPassword';
    const hashedValue = 'hashed-password';

    bcrypt.hash.mockResolvedValue(hashedValue);

    const result = await doHashing(value);

    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledWith(value, 12);
    expect(result).toBe(hashedValue);
  });
});

describe('doCompare',  () => {
    it('compares the value with the hashed value using bcrypt', async () => {
    const value = 'testPassword';
    const hashedValue = 'hashed-password';
     bcrypt.compare.mockResolvedValue(true);
     const result = await doCompare(value, hashedValue);
     expect(bcrypt.compare).toHaveBeenCalledOnce();
     expect(bcrypt.compare).toHaveBeenCalledWith(value, hashedValue);
     expect(result).toBe(true);
})
});