import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  PlusCircle,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Eye,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard/metrics');
      return res.data.data;
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Syncing live dashboard metrics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 shadow-sm">
        <h3 className="font-bold text-base">Failed to load dashboard metrics</h3>
        <p className="text-xs mt-1">Please ensure the backend server is running and accessible.</p>
      </div>
    );
  }

  const role = user?.role;
  const metrics = data.metrics;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-7 rounded-3xl shadow-xl border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/15 text-[11px] font-extrabold text-amber-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {role === 'EMPLOYEE' && 'Employee Self-Service Hub'}
              {role === 'DIRECTOR' && 'Director Approval Command Center'}
              {role === 'ACCOUNTS' && 'Accounts & Settlement Portal'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed font-normal">
            {role === 'EMPLOYEE' && 'Track your expense reimbursement claims, create drafts, and attach e-signatures for Director approval.'}
            {role === 'DIRECTOR' && 'Review pending voucher submissions across departments, inspect dual signatures, and authorize payouts.'}
            {role === 'ACCOUNTS' && 'Monitor organization-wide expense vouchers, verify authorization signatures, and process settlements.'}
          </p>
        </div>

        {role === 'EMPLOYEE' && (
          <Link
            to="/vouchers/create"
            className="relative z-10 inline-flex items-center px-5 py-3 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create New Voucher
          </Link>
        )}
      </div>

      {/* Role Metrics Grid */}
      {role === 'EMPLOYEE' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard title="Total Vouchers" value={metrics.totalVouchers} icon={FileText} color="slate" />
          <StatCard title="Draft Vouchers" value={metrics.draftVouchers} icon={FileSpreadsheet} color="slate" subtitle="Editable Drafts" />
          <StatCard title="Pending Approval" value={metrics.pendingApproval} icon={Clock} color="amber" subtitle="Awaiting Director" />
          <StatCard title="Approved Vouchers" value={metrics.approvedVouchers} icon={CheckCircle2} color="emerald" />
          <StatCard title="Rejected Vouchers" value={metrics.rejectedVouchers} icon={XCircle} color="rose" />
          <StatCard title="Total Amount Claimed" value={formatCurrency(metrics.totalAmountClaimed)} icon={DollarSign} color="blue" subtitle="Submitted & Approved" />
        </div>
      )}

      {role === 'DIRECTOR' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Pending Approval" value={metrics.pendingApprovalCount} icon={Clock} color="amber" subtitle="Action Required" />
          <StatCard title="Approved Today" value={metrics.approvedToday} icon={CheckCircle2} color="emerald" />
          <StatCard title="Rejected Today" value={metrics.rejectedToday} icon={XCircle} color="rose" />
          <StatCard title="Total Pending Amount" value={formatCurrency(metrics.totalPendingAmount)} icon={DollarSign} color="purple" />
        </div>
      )}

      {role === 'ACCOUNTS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <StatCard title="Total Vouchers" value={metrics.totalVouchers} icon={FileText} color="slate" />
          <StatCard title="Pending Approval" value={metrics.pendingApproval} icon={Clock} color="amber" />
          <StatCard title="Approved Vouchers" value={metrics.approvedVouchers} icon={CheckCircle2} color="emerald" />
          <StatCard title="Rejected Vouchers" value={metrics.rejectedVouchers} icon={XCircle} color="rose" />
          <StatCard title="Total Approved Amount" value={formatCurrency(metrics.totalApprovedExpenseAmount)} icon={DollarSign} color="emerald" subtitle="Ready for Payment" />
        </div>
      )}

      {/* Recent Activity Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Recent Voucher Activity</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {role === 'EMPLOYEE' && 'Your latest created and submitted expense vouchers'}
              {role === 'DIRECTOR' && 'Latest voucher submissions requiring evaluation or review'}
              {role === 'ACCOUNTS' && 'Recently approved vouchers ready for reimbursement payment'}
            </p>
          </div>
          <Link
            to="/vouchers"
            className="inline-flex items-center text-xs font-bold text-brand-600 hover:text-brand-700 transition"
          >
            View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Voucher #</th>
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Title & Category</th>
                <th className="py-3.5 px-6 text-right">Amount</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Expense Date</th>
                <th className="py-3.5 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {(data.recentVouchers || data.recentActivity || data.recentApprovedVouchers || []).map((v: any) => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 font-mono font-extrabold text-brand-700">{v.voucherNumber}</td>
                  <td className="py-4 px-6 font-semibold text-slate-800">
                    {v.employee?.name || 'Self'}
                  </td>
                  <td className="py-4 px-6 text-slate-600">{v.department}</td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-900 block">{v.expenseTitle}</span>
                    <span className="text-[11px] text-slate-400 font-normal">{v.expenseCategory}</span>
                  </td>
                  <td className="py-4 px-6 text-right font-black text-slate-900 text-sm">
                    {formatCurrency(v.amount)}
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="py-4 px-6 text-slate-500">{formatDate(v.expenseDate)}</td>
                  <td className="py-4 px-6 text-center">
                    <Link
                      to={`/vouchers/${v.id}`}
                      className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white border border-brand-200/80 font-extrabold text-xs rounded-xl transition-all shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>
                  </td>
                </tr>
              ))}

              {(!data.recentVouchers && !data.recentActivity && !data.recentApprovedVouchers) ||
                ((data.recentVouchers || data.recentActivity || data.recentApprovedVouchers)?.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                      No voucher activity recorded yet.
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
