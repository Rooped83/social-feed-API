import express from 'express';
import dotenv from 'dotenv'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import routes from './routes/index.js';
import { errorHandler } from './core/errors/errorHandler.js';
import { dynamicRateLimiter } from './middlewares/rateLimit.js';
const app = express();
dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(dynamicRateLimiter('anonymous'));
//routes
app.use('/api/', routes);
//error handler
app.use(errorHandler);

export default app;