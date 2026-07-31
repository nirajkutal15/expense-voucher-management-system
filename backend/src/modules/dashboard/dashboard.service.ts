import { prisma } from '../../config';
import { Role, VoucherStatus } from '../../constants';
import { JwtPayload } from '../../utils/jwt';

export class DashboardService {
  async getMetrics(user: JwtPayload) {
    if (user.role === Role.EMPLOYEE) {
      return this.getEmployeeMetrics(user.userId);
    } else if (user.role === Role.DIRECTOR) {
      return this.getDirectorMetrics();
    } else if (user.role === Role.ACCOUNTS) {
      return this.getAccountsMetrics();
    }
    throw new Error('Invalid user role for dashboard metrics');
  }

  private async getEmployeeMetrics(userId: string) {
    const [total, draft, pending, approved, rejected, totalAmountRaw, recentVouchers] = await Promise.all([
      prisma.voucher.count({ where: { employeeId: userId } }),
      prisma.voucher.count({ where: { employeeId: userId, status: VoucherStatus.DRAFT } }),
      prisma.voucher.count({ where: { employeeId: userId, status: VoucherStatus.PENDING_APPROVAL } }),
      prisma.voucher.count({ where: { employeeId: userId, status: VoucherStatus.APPROVED } }),
      prisma.voucher.count({ where: { employeeId: userId, status: VoucherStatus.REJECTED } }),
      prisma.voucher.aggregate({
        where: { employeeId: userId, status: { in: [VoucherStatus.PENDING_APPROVAL, VoucherStatus.APPROVED] } },
        _sum: { amount: true },
      }),
      prisma.voucher.findMany({
        where: { employeeId: userId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
    ]);

    const totalAmountClaimed = Number(totalAmountRaw._sum.amount || 0);

    return {
      role: Role.EMPLOYEE,
      metrics: {
        totalVouchers: total,
        draftVouchers: draft,
        pendingApproval: pending,
        approvedVouchers: approved,
        rejectedVouchers: rejected,
        totalAmountClaimed,
      },
      recentVouchers,
    };
  }

  private async getDirectorMetrics() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [pendingCount, approvedToday, rejectedToday, totalPendingRaw, recentActivity] = await Promise.all([
      prisma.voucher.count({ where: { status: VoucherStatus.PENDING_APPROVAL } }),
      prisma.voucher.count({
        where: {
          status: VoucherStatus.APPROVED,
          approvalDate: { gte: startOfToday },
        },
      }),
      prisma.voucher.count({
        where: {
          status: VoucherStatus.REJECTED,
          updatedAt: { gte: startOfToday },
        },
      }),
      prisma.voucher.aggregate({
        where: { status: VoucherStatus.PENDING_APPROVAL },
        _sum: { amount: true },
      }),
      prisma.voucher.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 6,
        include: {
          employee: { select: { name: true, employeeId: true } },
        },
      }),
    ]);

    return {
      role: Role.DIRECTOR,
      metrics: {
        pendingApprovalCount: pendingCount,
        approvedToday,
        rejectedToday,
        totalPendingAmount: Number(totalPendingRaw._sum.amount || 0),
      },
      recentActivity,
    };
  }

  private async getAccountsMetrics() {
    const [total, pending, approved, rejected, totalApprovedRaw, recentApprovedVouchers] = await Promise.all([
      prisma.voucher.count(),
      prisma.voucher.count({ where: { status: VoucherStatus.PENDING_APPROVAL } }),
      prisma.voucher.count({ where: { status: VoucherStatus.APPROVED } }),
      prisma.voucher.count({ where: { status: VoucherStatus.REJECTED } }),
      prisma.voucher.aggregate({
        where: { status: VoucherStatus.APPROVED },
        _sum: { amount: true },
      }),
      prisma.voucher.findMany({
        where: { status: VoucherStatus.APPROVED },
        orderBy: { approvalDate: 'desc' },
        take: 6,
        include: {
          employee: { select: { name: true, employeeId: true } },
          director: { select: { name: true } },
        },
      }),
    ]);

    return {
      role: Role.ACCOUNTS,
      metrics: {
        totalVouchers: total,
        pendingApproval: pending,
        approvedVouchers: approved,
        rejectedVouchers: rejected,
        totalApprovedExpenseAmount: Number(totalApprovedRaw._sum.amount || 0),
      },
      recentApprovedVouchers,
    };
  }
}

export const dashboardService = new DashboardService();
