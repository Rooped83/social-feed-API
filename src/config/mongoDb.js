import mongoose from 'mongoose';
//import dotenv from 'dotenv';
//dotenv.config();
import { logger } from '../core/logger/logger.js';
import { config } from './index.js';

const connectDb = async () => {
    try {
        await mongoose.connect(config().dbURI);
        logger.info('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

export default connectDb;