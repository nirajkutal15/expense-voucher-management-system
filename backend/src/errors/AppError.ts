import { HTTP_STATUS } from '../constants';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errorCode: string = 'INTERNAL_ERROR',
    details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', errorCode: string = 'BAD_REQUEST', details?: unknown) {
    super(message, HTTP_STATUS.BAD_REQUEST, errorCode, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access', errorCode: string = 'UNAUTHORIZED', details?: unknown) {
    super(message, HTTP_STATUS.UNAUTHORIZED, errorCode, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied', errorCode: string = 'FORBIDDEN', details?: unknown) {
    super(message, HTTP_STATUS.FORBIDDEN, errorCode, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', errorCode: string = 'NOT_FOUND', details?: unknown) {
    super(message, HTTP_STATUS.NOT_FOUND, errorCode, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict', errorCode: string = 'CONFLICT', details?: unknown) {
    super(message, HTTP_STATUS.CONFLICT, errorCode, details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: unknown) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, 'VALIDATION_ERROR', details);
  }
}
