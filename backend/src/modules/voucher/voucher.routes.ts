import { Router } from 'express';
import { voucherController } from './voucher.controller';
import { authenticate, requireRole } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validate';
import {
  createVoucherSchema,
  updateVoucherSchema,
  submitVoucherSchema,
  approveVoucherSchema,
  rejectVoucherSchema,
  queryVoucherSchema,
} from './voucher.schema';
import { Role } from '../../constants';

const router = Router();

// Protect all voucher endpoints with JWT authentication
router.use(authenticate);

/**
 * @swagger
 * /vouchers:
 *   get:
 *     summary: List vouchers with search, filter, sorting, and pagination
 *     tags: [Vouchers]
 *   post:
 *     summary: Create a new expense voucher (Draft or Submit)
 *     tags: [Vouchers]
 */
router.get('/', validateRequest(queryVoucherSchema), voucherController.list);
router.post('/', requireRole(Role.EMPLOYEE), validateRequest(createVoucherSchema), voucherController.create);

/**
 * @swagger
 * /vouchers/{id}:
 *   get:
 *     summary: Get complete voucher details
 *     tags: [Vouchers]
 *   put:
 *     summary: Edit draft voucher (Owner employee only)
 *     tags: [Vouchers]
 *   delete:
 *     summary: Delete draft voucher (Owner employee only)
 *     tags: [Vouchers]
 */
router.get('/:id', voucherController.getById);
router.put('/:id', requireRole(Role.EMPLOYEE), validateRequest(updateVoucherSchema), voucherController.update);
router.delete('/:id', requireRole(Role.EMPLOYEE), voucherController.delete);

/**
 * @swagger
 * /vouchers/{id}/submit:
 *   post:
 *     summary: Submit draft voucher for approval
 *     tags: [Vouchers]
 */
router.post('/:id/submit', requireRole(Role.EMPLOYEE), validateRequest(submitVoucherSchema), voucherController.submit);

/**
 * @swagger
 * /vouchers/{id}/approve:
 *   post:
 *     summary: Director approves voucher
 *     tags: [Vouchers]
 */
router.post('/:id/approve', requireRole(Role.DIRECTOR), validateRequest(approveVoucherSchema), voucherController.approve);

/**
 * @swagger
 * /vouchers/{id}/reject:
 *   post:
 *     summary: Director rejects voucher
 *     tags: [Vouchers]
 */
router.post('/:id/reject', requireRole(Role.DIRECTOR), validateRequest(rejectVoucherSchema), voucherController.reject);

export default router;
