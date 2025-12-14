import app from './app.js';
import connectDb from './config/mongoDb.js';
import { config } from './config/index.js';
import { logger } from './core/logger/logger.js';

(async () => {
    try {
        await connectDb();
        const port = config.port || 3000;
        app.set('trust proxy', 1);
        app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error(`Failed to start server, error: ${error}`);
    }
})();