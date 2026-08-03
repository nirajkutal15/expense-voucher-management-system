import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middlewares/validate';
import { loginSchema, registerSchema } from './auth.schema';
import { authenticate } from '../../middlewares/auth';
import { authRateLimiter } from '../../middlewares/rateLimiter';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new employee account
 *     tags: [Auth]
 */
router.post('/register', authRateLimiter, validateRequest(registerSchema), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and issue tokens
 *     tags: [Auth]
 */
router.post('/login', authRateLimiter, validateRequest(loginSchema), authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token cookie
 *     tags: [Auth]
 */
router.post('/refresh', authController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Revoke refresh token and clear auth cookies
 *     tags: [Auth]
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', authenticate, authController.me);

export default router;
