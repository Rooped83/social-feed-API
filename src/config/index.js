// central config builder :
import './env.js'; 
;
import { requiredEnv } from './requiredEnv.js';

export const config = () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    dbURI: process.env.DB_URI || requiredEnv('DB_URI'),
    redisUsername: process.env.REDIS_USERNAME || 'default',
    redisHost: process.env.REDIS_HOST || requiredEnv('REDIS_HOST'),
    redisPort: process.env.REDIS_PORT || requiredEnv('REDIS_PORT'),
    redisPassword: process.env.REDIS_PASSWORD || requiredEnv('REDIS_PASSWORD'),
    tokenSecret: process.env.TOKEN_SECRET || requiredEnv('TOKEN_SECRET'),
    expirationTime: process.env.EXPIRATION_TIME || '1d',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || requiredEnv('REFRESH_TOKEN_SECRET'),
    refreshTokenExpirationTime: process.env.REFRESH_TOKEN_EXPIRATION_TIME || '3d',
    pepperSecret: process.env.PEPPER_SECRET || requiredEnv('PEPPER_SECRET'),
    smtpEmailFrom: process.env.SMTP_EmailFrom , 
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    logLevel: process.env.LOG_LEVEL || 'info'
});