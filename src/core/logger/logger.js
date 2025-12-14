import winston from 'winston';
import { config } from '../../config/index.js';

const {  combine, timestamp, printf, errors, json } = winston.format;
const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    const m = meta && Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${timestamp} ${level}: ${stack || message} ${m}`;
})
export const logger = winston.createLogger({
    level: config.logLevel,
    format: combine(timestamp(), errors({ stack: true }, logFormat), json()),
    transports: [ new  winston.transports.Console() ]
});
