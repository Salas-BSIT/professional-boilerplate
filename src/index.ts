import 'reflect-metadata';
import express from 'express';
import { config } from './config/env';
import { AppDataSource } from './config/data-source';
import { logger } from './utils/logger';
import {
    helmetMiddleware,
    corsMiddleware,
    apiLimiter
} from './middleware/security';
import { requestLoggingMiddleware } from './middleware/requestLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Import routes
import { userRoutes } from './routes/userRoutes';
import { healthRoutes } from './routes/healthRoutes';
import { authRoutes } from './routes/authRoutes'; // <- Add this

const app = express();

app.set('trust proxy', 1);

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);
app.use(requestLoggingMiddleware);

// Register routes
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes); // <- Add this
app.use('/api/users', userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
    try {
        await AppDataSource.initialize();
        logger.info('Database connection established');

        const server = app.listen(config.port, () => {
            logger.info(`Server is running on port ${config.port}`);
        });

        const shutdown = async (signal: string): Promise<void> => {
            logger.info(`${signal} received. Shutting down gracefully.`);
            server.close(async (serverError) => {
                if (serverError) {
                    logger.error('HTTP server shutdown failed', { error: serverError });
                    process.exitCode = 1;
                }
                try {
                    if (AppDataSource.isInitialized) {
                        await AppDataSource.destroy();
                    }
                } catch (databaseError) {
                    logger.error('Database shutdown failed', { error: databaseError });
                    process.exitCode = 1;
                }
            });
        };

        process.once('SIGINT', () => void shutdown('SIGINT'));
        process.once('SIGTERM', () => void shutdown('SIGTERM'));
    } catch (error) {
        logger.error('Application startup failed', { error });
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
        process.exit(1);
    }
};

void startServer();