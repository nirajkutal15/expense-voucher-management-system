import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';
import { config } from '../config';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error(err, 'Non-operational error occurred');
    }
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
        details: err.details || null,
      },
    });
    return;
  }

  // Handle unexpected syntax / internal server errors
  logger.error(err, 'Unhandled Exception in Express Pipeline');
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: config.NODE_ENV === 'production' ? 'An internal server error occurred' : err.message,
      details: config.NODE_ENV === 'development' ? err.stack : null,
    },
  });
};
