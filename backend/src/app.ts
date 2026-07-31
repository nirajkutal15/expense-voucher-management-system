import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { config, prisma } from './config';
import { swaggerSpec } from './swagger/swagger';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import voucherRoutes from './modules/voucher/voucher.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import uploadRoutes from './modules/upload/upload.routes';
import { HTTP_STATUS } from './constants';

export const createApp = (): Express => {
  const app: Express = express();

  // Security Headers via Helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS Configuration locked to allowed origins
  const allowedOrigins = config.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || config.NODE_ENV === 'development') {
          callback(null, true);
        } else {
          callback(new Error(`CORS origin '${origin}' not allowed`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser(config.COOKIE_SECRET));

  // Serve static signature uploads securely
  app.use('/api/v1/uploads', express.static(path.resolve(config.UPLOAD_DIR)));

  // Swagger Documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Health check endpoint
  app.get('/api/v1/health', async (_req: Request, res: Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(HTTP_STATUS.OK).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV,
        database: 'connected',
      });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
      });
    }
  });

  // API v1 Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/vouchers', voucherRoutes);
  app.use('/api/v1/dashboard', dashboardRoutes);
  app.use('/api/v1/uploads', uploadRoutes);

  // 404 Handler
  app.use((_req: Request, res: Response) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: 'The requested API route does not exist',
      },
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
