import { z } from 'zod';
import { VoucherStatus } from '../../constants';

export const createVoucherSchema = {
  body: z.object({
    expenseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid expense date',
    }),
    department: z.string().min(1, 'Department is mandatory'),
    expenseTitle: z.string().min(1, 'Expense title is mandatory'),
    expenseCategory: z.string().min(1, 'Expense category is mandatory'),
    expenseDescription: z.string().default(''),
    amount: z.number({ invalid_type_error: 'Amount must be a number' }).positive('Amount must be greater than zero'),
    saveAsDraft: z.boolean().default(true),
    employeeSignatureUrl: z.string().optional(),
  }),
};

export const updateVoucherSchema = {
  params: z.object({
    id: z.string().uuid('Invalid voucher ID'),
  }),
  body: z.object({
    expenseDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid expense date' }).optional(),
    department: z.string().min(1, 'Department is mandatory').optional(),
    expenseTitle: z.string().min(1, 'Expense title is mandatory').optional(),
    expenseCategory: z.string().min(1, 'Expense category is mandatory').optional(),
    expenseDescription: z.string().optional(),
    amount: z.number().positive('Amount must be greater than zero').optional(),
    employeeSignatureUrl: z.string().optional(),
    submitNow: z.boolean().optional(),
  }),
};

export const submitVoucherSchema = {
  params: z.object({
    id: z.string().uuid('Invalid voucher ID'),
  }),
  body: z.object({
    employeeSignatureUrl: z.string().min(1, 'Employee signature is mandatory before submission'),
  }),
};

export const approveVoucherSchema = {
  params: z.object({
    id: z.string().uuid('Invalid voucher ID'),
  }),
  body: z.object({
    directorSignatureUrl: z.string().min(1, 'Director signature is mandatory before approval'),
  }),
};

export const rejectVoucherSchema = {
  params: z.object({
    id: z.string().uuid('Invalid voucher ID'),
  }),
  body: z.object({
    rejectionReason: z.string().min(3, 'Rejection reason is mandatory if a voucher is rejected'),
  }),
};

export const queryVoucherSchema = {
  query: z.object({
    q: z.string().optional(),
    status: z.nativeEnum(VoucherStatus).optional(),
    department: z.string().optional(),
    expenseCategory: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    minAmount: z.string().transform((val) => (val ? parseFloat(val) : undefined)).optional(),
    maxAmount: z.string().transform((val) => (val ? parseFloat(val) : undefined)).optional(),
    sortBy: z.enum(['createdAt', 'voucherDate', 'amount', 'voucherNumber', 'status']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    page: z.string().default('1').transform((val) => parseInt(val, 10)),
    limit: z.string().default('10').transform((val) => parseInt(val, 10)),
  }),
};
