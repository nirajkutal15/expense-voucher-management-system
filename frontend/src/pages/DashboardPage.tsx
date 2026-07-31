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
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
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
    <div className="space-y-8">
      {/* Dynamic Welcome Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-8 rounded-3xl text-white shadow-2xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/15 text-[11px] font-bold text-brand-300 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {role === 'EMPLOYEE' && 'Employee Self-Service Hub'}
              {role === 'DIRECTOR' && 'Director Approval Command Center'}
              {role === 'ACCOUNTS' && 'Accounts & Reimbursement Center'}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 max-w-xl leading-relaxed">
            {role === 'EMPLOYEE' && 'Track reimbursement claims, manage draft expenses, and submit requests for Director sign-off.'}
            {role === 'DIRECTOR' && 'Review pending voucher submissions across departments, inspect signatures, and process approvals.'}
            {role === 'ACCOUNTS' && 'Monitor organization-wide expense vouchers, verify authorization signatures, and issue payouts.'}
          </p>
        </div>

        {role === 'EMPLOYEE' && (
          <Link
            to="/vouchers/create"
            className="relative z-10 inline-flex items-center px-5 py-3 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-brand-600/30 transition-all hover:scale-[1.02] self-start md:self-auto"
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

      {/* Recent Activity Data Table */}
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
                      className="inline-flex items-center px-3.5 py-1.5 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 font-extrabold text-xs rounded-xl transition"
                    >
                      View Details
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
