import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config';
import { Role } from '../constants';
import { UnauthorizedError } from '../errors/AppError';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: config.JWT_EXPIRES_IN as any,
  };
  return jwt.sign(payload, config.JWT_SECRET, options);
};

export const generateRefreshToken = (payload: { userId: string }): string => {
  const options: SignOptions = {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN as any,
  };
  return jwt.sign({ ...payload, jti: crypto.randomUUID() }, config.JWT_REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as JwtPayload;
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired access token', 'EXPIRED_ACCESS_TOKEN');
  }
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as { userId: string };
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired refresh token', 'EXPIRED_REFRESH_TOKEN');
  }
};
