import { Request, Response, NextFunction } from 'express';
import { voucherService } from './voucher.service';
import { HTTP_STATUS } from '../../constants';

export class VoucherController {
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const voucher = await voucherService.createVoucher(req.user!, req.body);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: voucher,
      });
    } catch (err) {
      next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await voucherService.getVouchers(req.user!, req.query as any);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.vouchers,
        pagination: result.pagination,
      });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const voucher = await voucherService.getVoucherById(req.user!, req.params.id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: voucher,
      });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const voucher = await voucherService.updateVoucher(req.user!, req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: voucher,
      });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await voucherService.deleteVoucher(req.user!, req.params.id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: { message: 'Draft voucher deleted successfully' },
      });
    } catch (err) {
      next(err);
    }
  };

  submit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const voucher = await voucherService.submitVoucher(
        req.user!,
        req.params.id,
        req.body.employeeSignatureUrl
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: voucher,
      });
    } catch (err) {
      next(err);
    }
  };

  approve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const voucher = await voucherService.approveVoucher(
        req.user!,
        req.params.id,
        req.body.directorSignatureUrl
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: voucher,
      });
    } catch (err) {
      next(err);
    }
  };

  reject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const voucher = await voucherService.rejectVoucher(
        req.user!,
        req.params.id,
        req.body.rejectionReason
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: voucher,
      });
    } catch (err) {
      next(err);
    }
  };
}

export const voucherController = new VoucherController();
