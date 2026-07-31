import { Prisma } from '@prisma/client';
import { prisma } from '../../config';
import { Role, VoucherStatus } from '../../constants';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../errors/AppError';
import { JwtPayload } from '../../utils/jwt';

export interface CreateVoucherInput {
  expenseDate: string;
  department: string;
  expenseTitle: string;
  expenseCategory: string;
  expenseDescription?: string;
  amount: number;
  saveAsDraft?: boolean;
  employeeSignatureUrl?: string;
}

export interface QueryVouchersParams {
  q?: string;
  status?: VoucherStatus;
  department?: string;
  expenseCategory?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'createdAt' | 'voucherDate' | 'amount' | 'voucherNumber' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class VoucherService {
  private async generateVoucherNumber(): Promise<string> {
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = `VCH-${todayStr}`;

    const latestVoucher = await prisma.voucher.findFirst({
      where: {
        voucherNumber: { startsWith: prefix },
      },
      orderBy: { voucherNumber: 'desc' },
    });

    let nextSeq = 1;
    if (latestVoucher) {
      const parts = latestVoucher.voucherNumber.split('-');
      if (parts.length === 3) {
        const parsed = parseInt(parts[2], 10);
        if (!isNaN(parsed)) {
          nextSeq = parsed + 1;
        }
      }
    }

    const seqStr = String(nextSeq).padStart(4, '0');
    return `${prefix}-${seqStr}`;
  }

  async createVoucher(user: JwtPayload, input: CreateVoucherInput) {
    if (user.role !== Role.EMPLOYEE) {
      throw new ForbiddenError('Only employees can create expense vouchers');
    }

    const status = input.saveAsDraft ? VoucherStatus.DRAFT : VoucherStatus.PENDING_APPROVAL;

    if (status === VoucherStatus.PENDING_APPROVAL && !input.employeeSignatureUrl) {
      throw new ValidationError('Employee signature is mandatory before submitting a voucher for approval');
    }

    const voucherNumber = await this.generateVoucherNumber();

    const voucher = await prisma.voucher.create({
      data: {
        voucherNumber,
        expenseDate: new Date(input.expenseDate),
        department: input.department,
        expenseTitle: input.expenseTitle,
        expenseCategory: input.expenseCategory,
        expenseDescription: input.expenseDescription || '',
        amount: input.amount,
        status,
        employeeId: user.userId,
        employeeSignatureUrl: input.employeeSignatureUrl || null,
      },
      include: {
        employee: {
          select: { id: true, name: true, email: true, employeeId: true },
        },
        director: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return voucher;
  }

  async getVouchers(user: JwtPayload, params: QueryVouchersParams) {
    const {
      q,
      status,
      department,
      expenseCategory,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = params;

    const where: Prisma.VoucherWhereInput = {};

    // Role-based visibility scoping
    if (user.role === Role.EMPLOYEE) {
      where.employeeId = user.userId;
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    // Department filter
    if (department) {
      where.department = { equals: department };
    }

    // Category filter
    if (expenseCategory) {
      where.expenseCategory = { equals: expenseCategory };
    }

    // Text search (Voucher number, Title, Employee Name, Description)
    if (q && q.trim() !== '') {
      const searchTerm = q.trim();
      where.OR = [
        { voucherNumber: { contains: searchTerm } },
        { expenseTitle: { contains: searchTerm } },
        { expenseDescription: { contains: searchTerm } },
        { employee: { name: { contains: searchTerm } } },
      ];
    }

    // Date Range Filter
    if (startDate || endDate) {
      where.expenseDate = {};
      if (startDate) {
        where.expenseDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.expenseDate.lte = new Date(endDate);
      }
    }

    // Amount Range Filter
    if (minAmount !== undefined || maxAmount !== undefined) {
      where.amount = {};
      if (minAmount !== undefined) {
        where.amount.gte = minAmount;
      }
      if (maxAmount !== undefined) {
        where.amount.lte = maxAmount;
      }
    }

    const skip = (page - 1) * limit;

    const [vouchers, total] = await Promise.all([
      prisma.voucher.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
        include: {
          employee: {
            select: { id: true, name: true, email: true, employeeId: true },
          },
          director: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.voucher.count({ where }),
    ]);

    return {
      vouchers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getVoucherById(user: JwtPayload, id: string) {
    const voucher = await prisma.voucher.findUnique({
      where: { id },
      include: {
        employee: {
          select: { id: true, name: true, email: true, employeeId: true },
        },
        director: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!voucher) {
      throw new NotFoundError(`Expense voucher with ID ${id} not found`);
    }

    // Scoping check for employees
    if (user.role === Role.EMPLOYEE && voucher.employeeId !== user.userId) {
      throw new ForbiddenError('Employees can only view expense vouchers created by themselves');
    }

    return voucher;
  }

  async updateVoucher(user: JwtPayload, id: string, input: Partial<CreateVoucherInput> & { submitNow?: boolean }) {
    if (user.role !== Role.EMPLOYEE) {
      throw new ForbiddenError('Only employees can update draft vouchers');
    }

    const existing = await prisma.voucher.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Expense voucher with ID ${id} not found`);
    }

    if (existing.employeeId !== user.userId) {
      throw new ForbiddenError('You can only edit your own vouchers');
    }

    if (existing.status !== VoucherStatus.DRAFT) {
      throw new BadRequestError(`Cannot edit voucher in ${existing.status} status. Only DRAFT vouchers can be modified.`);
    }

    let newStatus: VoucherStatus = existing.status;
    if (input.submitNow) {
      const signature = input.employeeSignatureUrl || existing.employeeSignatureUrl;
      if (!signature) {
        throw new ValidationError('Employee signature is mandatory before submitting for approval');
      }
      newStatus = VoucherStatus.PENDING_APPROVAL;
    }

    const updateData: Prisma.VoucherUpdateInput = {
      status: newStatus,
    };

    if (input.expenseDate) updateData.expenseDate = new Date(input.expenseDate);
    if (input.department) updateData.department = input.department;
    if (input.expenseTitle) updateData.expenseTitle = input.expenseTitle;
    if (input.expenseCategory) updateData.expenseCategory = input.expenseCategory;
    if (input.expenseDescription !== undefined) updateData.expenseDescription = input.expenseDescription;
    if (input.amount) updateData.amount = input.amount;
    if (input.employeeSignatureUrl) updateData.employeeSignatureUrl = input.employeeSignatureUrl;

    const updated = await prisma.voucher.update({
      where: { id },
      data: updateData,
      include: {
        employee: { select: { id: true, name: true, email: true, employeeId: true } },
        director: { select: { id: true, name: true, email: true } },
      },
    });

    return updated;
  }

  async deleteVoucher(user: JwtPayload, id: string) {
    if (user.role !== Role.EMPLOYEE) {
      throw new ForbiddenError('Only employees can delete draft vouchers');
    }

    const existing = await prisma.voucher.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Expense voucher with ID ${id} not found`);
    }

    if (existing.employeeId !== user.userId) {
      throw new ForbiddenError('You can only delete your own vouchers');
    }

    if (existing.status !== VoucherStatus.DRAFT) {
      throw new BadRequestError(`Cannot delete voucher in ${existing.status} status. Only DRAFT vouchers can be deleted.`);
    }

    await prisma.voucher.delete({ where: { id } });
    return true;
  }

  async submitVoucher(user: JwtPayload, id: string, signatureUrl: string) {
    if (user.role !== Role.EMPLOYEE) {
      throw new ForbiddenError('Only employees can submit vouchers for approval');
    }

    const voucher = await prisma.voucher.findUnique({ where: { id } });
    if (!voucher) {
      throw new NotFoundError(`Voucher ${id} not found`);
    }

    if (voucher.employeeId !== user.userId) {
      throw new ForbiddenError('You can only submit your own vouchers');
    }

    if (voucher.status !== VoucherStatus.DRAFT) {
      throw new BadRequestError(`Voucher is already in ${voucher.status} status and cannot be submitted again`);
    }

    if (!signatureUrl && !voucher.employeeSignatureUrl) {
      throw new ValidationError('Employee signature is mandatory before submitting for approval');
    }

    const updated = await prisma.voucher.update({
      where: { id },
      data: {
        status: VoucherStatus.PENDING_APPROVAL,
        employeeSignatureUrl: signatureUrl || voucher.employeeSignatureUrl,
      },
      include: {
        employee: { select: { id: true, name: true, email: true, employeeId: true } },
        director: { select: { id: true, name: true, email: true } },
      },
    });

    return updated;
  }

  async approveVoucher(user: JwtPayload, id: string, directorSignatureUrl: string) {
    if (user.role !== Role.DIRECTOR) {
      throw new ForbiddenError('Only the Director can approve vouchers');
    }

    const voucher = await prisma.voucher.findUnique({ where: { id } });
    if (!voucher) {
      throw new NotFoundError(`Voucher ${id} not found`);
    }

    if (voucher.status !== VoucherStatus.PENDING_APPROVAL) {
      throw new BadRequestError(`Cannot approve voucher in ${voucher.status} status. Only PENDING_APPROVAL vouchers can be approved.`);
    }

    if (!directorSignatureUrl) {
      throw new ValidationError('Director signature is mandatory before approving a voucher');
    }

    const updated = await prisma.voucher.update({
      where: { id },
      data: {
        status: VoucherStatus.APPROVED,
        directorId: user.userId,
        directorSignatureUrl,
        approvalDate: new Date(),
      },
      include: {
        employee: { select: { id: true, name: true, email: true, employeeId: true } },
        director: { select: { id: true, name: true, email: true } },
      },
    });

    return updated;
  }

  async rejectVoucher(user: JwtPayload, id: string, rejectionReason: string) {
    if (user.role !== Role.DIRECTOR) {
      throw new ForbiddenError('Only the Director can reject vouchers');
    }

    const voucher = await prisma.voucher.findUnique({ where: { id } });
    if (!voucher) {
      throw new NotFoundError(`Voucher ${id} not found`);
    }

    if (voucher.status !== VoucherStatus.PENDING_APPROVAL) {
      throw new BadRequestError(`Cannot reject voucher in ${voucher.status} status. Only PENDING_APPROVAL vouchers can be rejected.`);
    }

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      throw new ValidationError('Rejection reason is mandatory when rejecting a voucher');
    }

    const updated = await prisma.voucher.update({
      where: { id },
      data: {
        status: VoucherStatus.REJECTED,
        directorId: user.userId,
        rejectionReason: rejectionReason.trim(),
      },
      include: {
        employee: { select: { id: true, name: true, email: true, employeeId: true } },
        director: { select: { id: true, name: true, email: true } },
      },
    });

    return updated;
  }
}

export const voucherService = new VoucherService();
