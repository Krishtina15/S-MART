import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import productRoutes from './routes/product.route.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './config/logger.js';
import morganMiddleware from './config/morganLogger.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Logging Middleware
app.use(morganMiddleware);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', productRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    
    // Close server & exit process
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    
    // Close server & exit process
    server.close(() => process.exit(1));
});

export default app;