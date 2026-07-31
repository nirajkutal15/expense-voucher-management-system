export type Role = 'EMPLOYEE' | 'DIRECTOR' | 'ACCOUNTS';

export type VoucherStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  name: string;
  employeeId?: string;
  role: Role;
}

export interface Voucher {
  id: string;
  voucherNumber: string;
  voucherDate: string;
  expenseDate: string;
  department: string;
  expenseTitle: string;
  expenseCategory: string;
  expenseDescription: string;
  amount: number | string;
  status: VoucherStatus;
  employeeId: string;
  employee: {
    id: string;
    name: string;
    email: string;
    employeeId?: string;
  };
  employeeSignatureUrl?: string;
  directorId?: string;
  director?: {
    id: string;
    name: string;
    email: string;
  };
  directorSignatureUrl?: string;
  approvalDate?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationMeta;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface VoucherQueryParams {
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
