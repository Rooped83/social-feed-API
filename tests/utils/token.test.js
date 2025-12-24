import jwt, { sign } from 'jsonwebtoken';
import { vi, describe, test, expect } from 'vitest';
import { generateToken } from '../../src/core/utils/token';
vi.mock('jsonwebtoken', () => ({
    default:{
    sign: vi.fn()
    }
}));

describe('jwt', () => {
    test('returns a jwt token', async () => {
        const user = { id: 1, username: 'testuser' };
         jwt.sign.mockReturnValue('testToken');;
        const token = generateToken(user);

        expect(typeof token).toBe('string');

    })
})