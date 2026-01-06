import * as userRepo from '../user/userRepo.js';
import * as authRepo from './authRepo.js';
import { generateToken } from '../../core/utils/token.js';
import { ERROR_CODES } from '../../core/errors/errorCodes.js';
import AppError from '../../core/errors/appError.js';
import { doHashing, doCompare } from '../../core/utils/hashing.js';
import { generateVerificationCode, hashVerificationCode } from './helpers/generateVerficationCode.js';
import { sendVerificationEmail, sendForgotPasswordEmail } from './helpers/mailer.js';
import UserSerializer from '../user/userSerializer.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../../config/index.js';
import { redisClient } from '../../config/redisClient.js'

export const signUp = async (email, password, name) => {
    // check if user exists
    const existingUser = await userRepo.getUserByEmail(email);
    if (existingUser) {
        const { code, message, statusCode } = ERROR_CODES.USER_ALREADY_EXIST;
        throw new AppError( message, statusCode, code)
    }
    // hash password
    const hashedPassword = await doHashing(password)
    // create user
    const user = await userRepo.createUser({
        email,
        password: hashedPassword,
        name
    });
    const serializedUser = UserSerializer.base(user);
    // generate token
    const accessToken = token(serializedUser);
    return { user: serializedUser, accessToken };
};
//signIn service 
export const signIn = async (email, password) => {
    // check if exists
    const user = await userRepo.getUserByEmail(email);
    if (!user) {
        const { code, message, statusCode } = ERROR_CODES.USER_NOT_FOUND;
        throw new AppError(message, statusCode, code);
    }
    //check password
    const isMatch = await doCompare(password, user.password);
    if (!isMatch) {
        const { code, message, statusCode } = ERROR_CODES.WRONG_PASSWORD;
        throw new AppError(message, statusCode, code);
    }
    const tokenId = crypto.randomUUID()
     const serializedUser = UserSerializer.base(user);
    // generate token
    const accessToken = generateToken(serializedUser);
    const refreshToken = generateToken(serializedUser, tokenId);
    // store refresh token in redis
    const redisKey = `refreshToken: ${serializedUser.id}: ${tokenId}`;
    await redisClient.set(redisKey, 'valid', {
        EX: 7 * 24 * 60 * 60 
    });
    return { user: serializedUser, accessToken, refreshToken };
    };

    //sign out logic
    export const signOut = async (refreshToken) => {
        if (!refreshToken || typeof refreshToken !== 'string') {
            return false;
        }

        const payload = jwt.verify(refreshToken, config().refreshTokenSecret)

        redisClient.del(`refreshToken: ${payload.sub}: ${payload.jwtId}`);
        return true;
    };

    // send verification code logic:
    export const sendEmailVerificationCode = async (email) => {
        // check if exists
        const existingUser = await userRepo.getUserByEmail(email);
        if (!existingUser) {
        const { message, statusCode, code } = ERROR_CODES.USER_NOT_FOUND;
        throw new AppError(message, statusCode, code);
        };
        if (existingUser.verified === true) {
        const { message, statusCode, code } = ERROR_CODES.USER_ALREADY_VERIFIED; 
        throw new AppError(message, statusCode, code);
        }
        // generate code
        const code = generateVerificationCode();
        const hashedCode = hashVerificationCode(code);
        // set expiration and save in Db
        const expirationTime = new Date(Date.now() + 5 * 60000) 
        await authRepo.createVerificationCode({
            userId: existingUser._id,
            hashedCode,
            expirationTime,
            type: 'email verification'
        });
        // send email
        await sendVerificationEmail({ user: existingUser, verificationCode: code });
        };
    
        // verify verification code logic:
        export const verifyVerificationCode = async (email, code) => {
            const normalizedCode = code.toString();
            const existingUser = await userRepo.getUserByEmail(email);
            if (!existingUser) {
                const { code, message, statusCode } = ERROR_CODES.USER_NOT_FOUND;
                throw new AppError(message, statusCode, code);
            }
            if (existingUser.emailVerified) {
                const { code, message, statusCode } = ERROR_CODES.USER_ALREADY_VERIFIED;
                throw new AppError(message, statusCode, code); 
            }
            const record = await authRepo.getVerificationCode({ userId: existingUser._id });
            if (!record) {
                const { code, message, statusCode } = ERROR_CODES.NO_VERIFICATION_CODE_FOUND;
                throw new AppError(message, statusCode, code);
            }
            if (record.expirationTime.getTime() < Date.now()) {
                const { code, message, statusCode } = ERROR_CODES.VERIFICATION_CODE_EXPIRED;
                throw new AppError(message, statusCode, code);
            }
            // check if code matches
            const isMatch = doCompare(normalizedCode, record.hashedCode);
            if (!isMatch) {
                const { code, message, statusCode } = ERROR_CODES.INVALID_VERIFICATION_CODE;
                throw new AppError(message, statusCode, code);
            }
            //update user as verified
            await userRepo.markAsVerified(existingUser._id);
            await authRepo.invalidateVerificationCodes({ userId: existingUser._id, type: 'email verification' });
        };
    
        //change password logic: 
        export const changePassword = async( email, oldPassword, newPassword) => {
            const existingUser = await userRepo.getUserByEmail(email);
            if (!existingUser) {
                const { code, message, statusCode } =ERROR_CODES.USER_NOT_FOUND;
                throw new AppError(message, statusCode, code);
            }
        //check old password:
        const isMatch = await doCompare(oldPassword, existingUser.password);
        if (!isMatch) {
            const { code, message, statusCode } = ERROR_CODES.WRONG_PASSWORD;
            throw new AppError(message, statusCode, code);
        }
        // update password:
        const hashedPassword = await doHashing(newPassword);
        existingUser.password = hashedPassword;
        await userRepo.updateUser(existingUser._id, hashedPassword);
    
};

// send forgot password code logic:
export const sendForgotPassCode = async (email) => {
    const existingUser = await userRepo.getUserByEmail(email);
    if (!existingUser) {
        const { code, message, statusCode } = ERROR_CODES.USER_NOT_FOUND
        throw new AppError(message, statusCode, code);
    };
    // generate code
    const code = generateVerificationCode();
    const hashedCode = hashVerificationCode(code);
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000)
    await authRepo.createVerificationCode({
        userId: existingUser._id,
        hashedCode,
        expirationTime,
        type: 'forgot password'
    });
    //send email
    await sendForgotPasswordEmail({ user: existingUser, verificationCode: code });
};

// verify forgot password code:
    export const verifyForgotPasswordCode = async (email, code, newPassword) => {
        const stringCode = String(code);
        const existingUser = await userRepo.getUserByEmail(email);
        if (!existingUser) {
            const { code, statusCode, message } = ERROR_CODES.USER_NOT_FOUND;
            throw new AppError(message, statusCode, code);
        }
        const serializedUser = UserSerializer.base(existingUser);
        const record = await authRepo.getVerificationCode({ userId: serializedUser.id });
        if (!record) {
            const { code, message, statusCode } = ERROR_CODES.NO_VERIFICATION_CODE_FOUND
            throw new AppError(message, statusCode, code);
        };
        if (record.expirationTime.getTime() < Date.now()) {
            const { code, message, statusCode } = ERROR_CODES.VERIFICATION_CODE_EXPIRED;
            throw new AppError(message, statusCode, code);
        };
        // check if code is valid:
        const hashedCode = hashVerificationCode(stringCode);
        if (hashedCode !== record.hashedCode) {
            const { code, message, statusCode } = ERROR_CODES.INVALID_VERIFICATION_CODE;
            throw new AppError(message, statusCode, code);
        }
        //update password
        const newPasswordHashed = await doHashing(newPassword);
        existingUser.password = newPasswordHashed;
        await userRepo.updateUser(serializedUser.id, existingUser.email, newPasswordHashed, existingUser.name);
        // mark code as used
        await authRepo.markAsUsed({ verificationCodeModelId: record._id });
    };



        

        
