import logger from '../config/logger.js';

const errorHandler = (err, req, res, next) => {
    // Log the error
    logger.error('Global Error Handler:', {
        message: err.message,
        stack: err.stack,
        method: req.method,
        path: req.path
    });

    // Determine status code
    const statusCode = err.statusCode || 500;

    // Send error response
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorHandler;