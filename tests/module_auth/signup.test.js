import { vi, describe, test, expect } from 'vitest';
import * as userRepo  from '../../src/modules/user/userRepo.js';
import  * as authService  from '../../src/modules/auth/authService.js';;
import AppError from '../../src/core/errors/appError.js';
import { doHashing } from '../../src/core/utils/hashing.js';
import  { generateToken } from '../../src/core/utils/token.js';
import UserSerializer from '../../src/modules/user/userSerializer.js';

vi.mock('../../src/modules/user/userRepo.js', () => ({
    getUserByEmail: vi.fn(),
    createUser: vi.fn()
}));
vi.mock('../../src/core/utils/hashing.js', () => ({
    doHashing: vi.fn()
}));
vi.mock('../../src/core/utils/token.js', () => ({
    generateToken: vi.fn()
}));
vi.mock('../../src/modules/user/userSerializer.js', () => ({
    default: {
        base: vi.fn()
    }
}));

 describe('signUp testing', () => {
    test('check if user already exist', async () => {
    userRepo.getUserByEmail.mockResolvedValue({
         id: 1,
        email: 'test@Email.com'
    });
    await expect(
        authService.signUp({email: 'test@Email.com',
            password: 'testPassword',
            name: 'Pedro' })
    ).rejects.toBeInstanceOf(AppError);
    });
});


test('signUp logic works correctly and returns the user with access token', async () => {
    userRepo.getUserByEmail.mockResolvedValue(null);
    doHashing.mockResolvedValue('testPassword')
    userRepo.createUser.mockResolvedValue({ id: 1 });
    UserSerializer.base.mockReturnValue({ id: 1, email: 'test@gmail.com'});
    generateToken.mockReturnValue('token');

    const result = await authService.signUp(
         'test@gmail.com',
         'testPassword',
         'Pedro'
    );

    expect(doHashing).toHaveBeenCalledWith('testPassword');
    expect(userRepo.createUser).toHaveBeenCalledWith({
         email: 'test@gmail.com',
         password: 'testPassword',
         name: 'Pedro'
});
    expect(result).toEqual({
        user: { id: 1, email: 'test@gmail.com' },
        accessToken: 'token'
    });
    })
    

