import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Pagination } from '../components/common/Pagination';
import { formatCurrency, formatDate } from '../utils/formatters';
import { VoucherQueryParams, VoucherStatus } from '../types';
import { Search, Filter, PlusCircle, ArrowUpDown, X } from 'lucide-react';

const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Finance & Accounts',
  'Human Resources',
  'Sales & Marketing',
  'Operations',
  'Executive',
];

const CATEGORIES = [
  'Travel & Conveyance',
  'Meals & Entertainment',
  'Office Supplies',
  'Software & Subscriptions',
  'Hardware & Equipment',
  'Utilities & Bills',
  'Training & Certifications',
  'Miscellaneous',
];

export const VoucherListPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state initialized from URL search params
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [status, setStatus] = useState<string>(searchParams.get('status') || '');
  const [department, setDepartment] = useState<string>(searchParams.get('department') || '');
  const [expenseCategory, setExpenseCategory] = useState<string>(searchParams.get('expenseCategory') || '');
  const [startDate, setStartDate] = useState<string>(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState<string>(searchParams.get('endDate') || '');
  const [minAmount, setMinAmount] = useState<string>(searchParams.get('minAmount') || '');
  const [maxAmount, setMaxAmount] = useState<string>(searchParams.get('maxAmount') || '');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>((searchParams.get('sortOrder') as any) || 'desc');
  const [page, setPage] = useState<number>(parseInt(searchParams.get('page') || '1', 10));

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (q) params.q = q;
    if (status) params.status = status;
    if (department) params.department = department;
    if (expenseCategory) params.expenseCategory = expenseCategory;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (minAmount) params.minAmount = minAmount;
    if (maxAmount) params.maxAmount = maxAmount;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (page > 1) params.page = String(page);

    setSearchParams(params, { replace: true });
  }, [q, status, department, expenseCategory, startDate, endDate, minAmount, maxAmount, sortBy, sortOrder, page, setSearchParams]);

  const queryParams: VoucherQueryParams = {
    q: q || undefined,
    status: (status as VoucherStatus) || undefined,
    department: department || undefined,
    expenseCategory: expenseCategory || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    minAmount: minAmount ? parseFloat(minAmount) : undefined,
    maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
    sortBy: sortBy as any,
    sortOrder,
    page,
    limit: 10,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['vouchers-list', queryParams],
    queryFn: async () => {
      const res = await apiClient.get('/vouchers', { params: queryParams });
      return res.data;
    },
  });

  const clearFilters = () => {
    setQ('');
    setStatus('');
    setDepartment('');
    setExpenseCategory('');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {user?.role === 'EMPLOYEE' ? 'My Expense Vouchers' : 'Organization Expense Vouchers'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {user?.role === 'EMPLOYEE'
              ? 'View, edit, and track status of all vouchers created by you.'
              : 'Search, filter, inspect details, and process organization expense vouchers.'}
          </p>
        </div>

        {user?.role === 'EMPLOYEE' && (
          <Link
            to="/vouchers/create"
            className="inline-flex items-center px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20 transition self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create New Voucher
          </Link>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Text Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search by Voucher #, Title, Description, or Employee..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
            />
          </div>

          {/* Quick Status Dropdown */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-48 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Toggle Advanced Filters */}
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`inline-flex items-center px-4 py-2.5 text-xs font-semibold rounded-xl border transition ${showAdvancedFilters || department || expenseCategory || startDate || minAmount
                ? 'bg-brand-50 border-brand-300 text-brand-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {(department || expenseCategory || startDate || minAmount) && (
              <span className="ml-1.5 w-2 h-2 rounded-full bg-brand-600" />
            )}
          </button>

          {(q || status || department || expenseCategory || startDate || endDate || minAmount || maxAmount) && (
            <button
              type="button"
              onClick={clearFilters}
              className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
              title="Clear all filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expanded Advanced Filters */}
        {showAdvancedFilters && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setPage(1);
                }}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Category</label>
              <select
                value={expenseCategory}
                onChange={(e) => {
                  setExpenseCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Date Range</label>
              <div className="flex items-center space-x-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Amount Range (₹)</label>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={minAmount}
                  onChange={(e) => {
                    setMinAmount(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxAmount}
                  onChange={(e) => {
                    setMaxAmount(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vouchers Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-slate-500 flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-2" />
            <span className="text-xs font-medium">Fetching vouchers...</span>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-rose-600 text-xs">
            Failed to load voucher list.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th
                      className="py-3.5 px-6 cursor-pointer hover:text-slate-900 transition"
                      onClick={() => toggleSort('voucherNumber')}
                    >
                      <div className="flex items-center">
                        Voucher # <ArrowUpDown className="w-3 h-3 ml-1" />
                      </div>
                    </th>
                    <th className="py-3.5 px-6">Employee</th>
                    <th className="py-3.5 px-6">Department</th>
                    <th className="py-3.5 px-6">Title & Category</th>
                    <th
                      className="py-3.5 px-6 text-right cursor-pointer hover:text-slate-900 transition"
                      onClick={() => toggleSort('amount')}
                    >
                      <div className="flex items-center justify-end">
                        Amount <ArrowUpDown className="w-3 h-3 ml-1" />
                      </div>
                    </th>
                    <th
                      className="py-3.5 px-6 cursor-pointer hover:text-slate-900 transition"
                      onClick={() => toggleSort('status')}
                    >
                      <div className="flex items-center">
                        Status <ArrowUpDown className="w-3 h-3 ml-1" />
                      </div>
                    </th>
                    <th
                      className="py-3.5 px-6 cursor-pointer hover:text-slate-900 transition"
                      onClick={() => toggleSort('expenseDate')}
                    >
                      <div className="flex items-center">
                        Expense Date <ArrowUpDown className="w-3 h-3 ml-1" />
                      </div>
                    </th>
                    <th className="py-3.5 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {data?.data?.map((v: any) => (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-6 font-mono font-bold text-brand-700">{v.voucherNumber}</td>
                      <td className="py-3.5 px-6 font-semibold text-slate-800">
                        {v.employee?.name || 'Self'}
                        {v.employee?.employeeId && (
                          <span className="block text-[10px] text-slate-400 font-normal">
                            ({v.employee.employeeId})
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-slate-600 font-medium">{v.department}</td>
                      <td className="py-3.5 px-6">
                        <span className="font-semibold text-slate-900 block">{v.expenseTitle}</span>
                        <span className="text-[11px] text-slate-400">{v.expenseCategory}</span>
                      </td>
                      <td className="py-3.5 px-6 text-right font-extrabold text-slate-900">
                        {formatCurrency(v.amount)}
                      </td>
                      <td className="py-3.5 px-6">
                        <StatusBadge status={v.status} />
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 font-medium">{formatDate(v.expenseDate)}</td>
                      <td className="py-3.5 px-6 text-center">
                        <Link
                          to={`/vouchers/${v.id}`}
                          className="inline-flex items-center px-3 py-1 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 font-bold text-xs rounded-lg transition"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {(!data?.data || data.data.length === 0) && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                        No expense vouchers match the selected search and filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {data?.pagination && (
              <Pagination
                pagination={data.pagination}
                onPageChange={(p) => setPage(p)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
