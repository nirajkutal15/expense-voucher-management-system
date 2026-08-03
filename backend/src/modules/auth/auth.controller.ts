import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { HTTP_STATUS } from '../../constants';
import { config } from '../../config';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
  sameSite: (config.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, name, employeeId } = req.body;
      const result = await authService.register({ email, password, name, employeeId });

      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      const result = await authService.refreshToken(token);

      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      await authService.logout(token);

      res.clearCookie('refreshToken', COOKIE_OPTIONS);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: { message: 'Logged out successfully' },
      });
    } catch (err) {
      next(err);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
        });
        return;
      }
      const user = await authService.getUserById(req.user.userId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  };
}

export const authController = new AuthController();
