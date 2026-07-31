import { Router } from 'express';
import { uploadController } from './upload.controller';
import { authenticate } from '../../middlewares/auth';
import { uploadSingleSignature } from '../../middlewares/upload';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /uploads/signature:
 *   post:
 *     summary: Upload signature image file
 *     tags: [Uploads]
 */
router.post('/signature', uploadSingleSignature, uploadController.uploadSignature);

/**
 * @swagger
 * /uploads/signature-base64:
 *   post:
 *     summary: Upload canvas signature as base64 string
 *     tags: [Uploads]
 */
router.post('/signature-base64', uploadController.uploadBase64Signature);

export default router;
