import { Request, Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service';
import { HTTP_STATUS } from '../../constants';

export class DashboardController {
  getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await dashboardService.getMetrics(req.user!);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  };
}

export const dashboardController = new DashboardController();
