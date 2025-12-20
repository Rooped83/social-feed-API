vi.mock('../../src/modules/user/userRepo.js', () => ({
        getUserByEmail: vi.fn()
}));
vi.mock('../../src/core/utils/token.js', () => ({
    generateToken: vi.fn()
}));
vi.mock('../../src/modules/user/userSerializer.js', () => ({
    default: {
            base: vi.fn()
        }
    }
));
vi.mock('../../core/errors/AppError.js', () => ({
    default: vi.fn()
}));
vi.mock('../../src/core/utils/hashing.js', () => ({
    doCompare: vi.fn(),
    doHashing: vi.fn()
}));

import * as userRepo from '../../src/modules/user/userRepo.js';
import * as authService from '../../src/modules/auth/authService.js';clear
import AppError from '../../src/core/errors/appError.js';
import { vi } from 'vitest';
 import { describe, test, expect } from 'vitest';
import { clear } from 'console';
import { generateToken } from '../../src/core/utils/token.js';
import UserSerializer from '../../src/modules/user/userSerializer.js';
import { doCompare, doHashing } from '../../src/core/utils/hashing.js';

describe('signin logic properly works', () => {
  test('throw error when user adoes not exist', async () => {
    userRepo.getUserByEmail.mockResolvedValue(null);
await expect(authService.signIn('testEmail', 'testPassword')).rejects.toBeInstanceOf(AppError);
  });

  test('throw error when password is wrong', async () => {
    userRepo.getUserByEmail.mockResolvedValue({ email: 'testEmail', password: 'testPassword' });
    await expect(authService.signIn('testEmail', 'wrongPassword')).rejects.toBeInstanceOf(AppError);
  })

  test('signIn logic properly works and returns user serialized and accessToken', async () => {
    const user = { 
        email: 'rooped83@test.com',
        password: 'password',
        name: 'pedro',
        id: 1
    };
    const serializedUser = {
        email: 'rooped83@test.com',
        name: 'Pedro',
        id: 1
    };

    userRepo.getUserByEmail.mockResolvedValue(user);
    doCompare.mockReturnValue(true);
    generateToken.mockReturnValue('token');
    UserSerializer.base.mockReturnValue(serializedUser);

    const result = await authService.signIn('rooped83@test.com', 'password');

    expect(userRepo.getUserByEmail).toHaveBeenCalledWith('rooped83@test.com');
    expect(UserSerializer.base).toHaveBeenCalledWith(user);
    expect(result).toEqual({ user: serializedUser, accessToken: 'token'})
  })
});
