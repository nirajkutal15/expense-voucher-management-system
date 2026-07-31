import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /dashboard/metrics:
 *   get:
 *     summary: Retrieve role-tailored dashboard metrics and activity
 *     tags: [Dashboard]
 */
router.get('/metrics', dashboardController.getMetrics);

export default router;
