import { createApp } from './app';
import { config, prisma } from './config';
import { logger } from './utils/logger';

const app = createApp();

const server = app.listen(config.PORT, () => {
  logger.info(`🚀 Expense Voucher API running on http://localhost:${config.PORT}`);
  logger.info(`📚 Swagger OpenAPI docs available at http://localhost:${config.PORT}/api/docs`);
  logger.info(`🏥 Health check endpoint at http://localhost:${config.PORT}/api/v1/health`);
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    await prisma.$disconnect();
    logger.info('Prisma Database disconnected.');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
