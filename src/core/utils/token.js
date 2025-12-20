import jwt from 'jsonwebtoken';
import { config } from '../../config/index.js';

// generate a signed JWT for a user object
export const generateToken = (user) => {
    if (!user || !user.id) {
        throw new Error('generateToken requires a user object with an id');
    }
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            emailVerified: user.emailVerified
        },
        config.tokenSecret,
        { expiresIn: config.expirationTime }
    );
};
