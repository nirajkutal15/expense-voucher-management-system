import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { verifyMagicBytes } from '../../middlewares/upload';
import { BadRequestError } from '../../errors/AppError';
import { HTTP_STATUS } from '../../constants';
import { config } from '../../config';

export class UploadController {
  uploadSignature = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        throw new BadRequestError('No signature image file uploaded');
      }

      const filePath = req.file.path;

      // Verify magic bytes for real file type validation
      const isValidImage = verifyMagicBytes(filePath);
      if (!isValidImage) {
        // Delete malicious file
        fs.unlinkSync(filePath);
        throw new BadRequestError('Uploaded file magic byte validation failed. Must be a valid PNG, JPEG, or WebP image.');
      }

      const relativePath = `/api/v1/uploads/${path.basename(filePath)}`;

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: {
          url: relativePath,
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  uploadBase64Signature = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { base64Data } = req.body;
      if (!base64Data || typeof base64Data !== 'string') {
        throw new BadRequestError('Invalid base64 signature data provided');
      }

      const matches = base64Data.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new BadRequestError('Base64 string must be a valid PNG, JPEG, or WebP data URL');
      }

      const ext = matches[1] === 'jpeg' ? '.jpg' : `.${matches[1]}`;
      const buffer = Buffer.from(matches[2], 'base64');

      if (buffer.length > config.MAX_FILE_SIZE) {
        throw new BadRequestError('Signature image size exceeds the 5MB limit');
      }

      const filename = `signature-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const filePath = path.join(config.UPLOAD_DIR, filename);

      fs.writeFileSync(filePath, buffer);

      if (!verifyMagicBytes(filePath)) {
        fs.unlinkSync(filePath);
        throw new BadRequestError('Magic byte verification failed for signature image');
      }

      const relativePath = `/api/v1/uploads/${filename}`;

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: {
          url: relativePath,
          filename,
          size: buffer.length,
        },
      });
    } catch (err) {
      next(err);
    }
  };
}

export const uploadController = new UploadController();
