import { VoucherStatus } from '../types';

export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
};

export const formatDateTime = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

export const getStatusBadgeStyle = (status: VoucherStatus): { bg: string; text: string; label: string } => {
  switch (status) {
    case 'DRAFT':
      return { bg: 'bg-slate-100 border-slate-300 text-slate-700', text: 'text-slate-700', label: 'Draft' };
    case 'PENDING_APPROVAL':
      return { bg: 'bg-amber-50 border-amber-300 text-amber-800', text: 'text-amber-800', label: 'Pending Approval' };
    case 'APPROVED':
      return { bg: 'bg-emerald-50 border-emerald-300 text-emerald-800', text: 'text-emerald-800', label: 'Approved' };
    case 'REJECTED':
      return { bg: 'bg-rose-50 border-rose-300 text-rose-800', text: 'text-rose-800', label: 'Rejected' };
    default:
      return { bg: 'bg-slate-100 border-slate-300 text-slate-700', text: 'text-slate-700', label: status };
  }
};
