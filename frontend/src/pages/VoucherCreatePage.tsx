import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '../api/client';
import { SignaturePad } from '../components/common/SignaturePad';
import { ArrowLeft, Save, Send, AlertCircle } from 'lucide-react';

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

const voucherSchema = z.object({
  expenseDate: z.string().min(1, 'Expense Date is mandatory'),
  department: z.string().min(1, 'Department is mandatory'),
  expenseTitle: z.string().min(1, 'Expense Title is mandatory'),
  expenseCategory: z.string().min(1, 'Expense Category is mandatory'),
  expenseDescription: z.string().optional(),
  amount: z.number({ invalid_type_error: 'Amount is mandatory and must be a number' }).positive('Amount must be greater than zero'),
});

type VoucherFormData = z.infer<typeof voucherSchema>;

export const VoucherCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [signatureUrl, setSignatureUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      expenseDate: new Date().toISOString().slice(0, 10),
      department: 'Engineering',
      expenseCategory: 'Software & Subscriptions',
    },
  });

  const onSubmit = async (formData: VoucherFormData, action: 'draft' | 'submit') => {
    if (action === 'submit' && !signatureUrl) {
      setErrorMsg('Employee signature is mandatory before submitting a voucher for approval.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const payload = {
        ...formData,
        saveAsDraft: action === 'draft',
        employeeSignatureUrl: signatureUrl || undefined,
      };

      const res = await apiClient.post('/vouchers', payload);

      if (res.data.success) {
        navigate(`/vouchers/${res.data.data.id}`);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'Failed to create voucher. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create New Expense Voucher</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in expense details. Save as draft to complete later, or attach signature and submit directly.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Validation / Submission Error</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      <form className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Expense Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Expense Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              {...register('expenseDate')}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
            {errors.expenseDate && <p className="text-xs text-rose-600 font-medium mt-1">{errors.expenseDate.message}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Department Name <span className="text-rose-500">*</span>
            </label>
            <select
              {...register('department')}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.department && <p className="text-xs text-rose-600 font-medium mt-1">{errors.department.message}</p>}
          </div>

          {/* Expense Title */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Expense Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. AWS Production Infrastructure License Q3"
              {...register('expenseTitle')}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
            {errors.expenseTitle && <p className="text-xs text-rose-600 font-medium mt-1">{errors.expenseTitle.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Expense Category <span className="text-rose-500">*</span>
            </label>
            <select
              {...register('expenseCategory')}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.expenseCategory && <p className="text-xs text-rose-600 font-medium mt-1">{errors.expenseCategory.message}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('amount', { valueAsNumber: true })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
            {errors.amount && <p className="text-xs text-rose-600 font-medium mt-1">{errors.amount.message}</p>}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Expense Description & Business Justification
            </label>
            <textarea
              rows={3}
              placeholder="Provide detailed breakdown or justification..."
              {...register('expenseDescription')}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Employee Signature Area */}
        <div className="pt-4 border-t border-slate-200">
          <SignaturePad
            label="Employee Signature (Mandatory for Approval Submission)"
            onSignatureChange={(url) => setSignatureUrl(url)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-slate-200">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
            className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
          >
            <Save className="w-4 h-4 mr-2" />
            Save as Draft
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit((data) => onSubmit(data, 'submit'))}
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/20 transition"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit for Approval
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
