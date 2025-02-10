import morgan from 'morgan';
import logger from './logger.js';

// Create a Morgan stream for Winston
const morganMiddleware = morgan(
    // Define log format
    ':method :url :status :response-time ms',
    {
        // Stream logs to Winston
        stream: {
            write: (message) => {
                logger.http(message.trim());
            }
        }
    }
);

export default morganMiddleware;