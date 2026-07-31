import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SignaturePad } from '../components/common/SignaturePad';
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters';
import { Voucher } from '../types';
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Send,
  AlertTriangle,
  Building2,
  Calendar,
  User,
  ShieldCheck,
} from 'lucide-react';

export const VoucherDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Director Action Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [directorSignatureUrl, setDirectorSignatureUrl] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const fetchVoucher = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get(`/vouchers/${id}`);
      setVoucher(res.data.data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'Failed to load voucher details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVoucher();
  }, [id]);

  const handleDeleteDraft = async () => {
    if (!window.confirm('Are you sure you want to delete this draft voucher? This action cannot be undone.')) {
      return;
    }

    try {
      await apiClient.delete(`/vouchers/${id}`);
      navigate('/vouchers');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to delete voucher');
    }
  };

  const handleSubmitDraft = async () => {
    if (!voucher?.employeeSignatureUrl) {
      alert('Please edit the draft and attach your signature before submitting for approval.');
      navigate(`/vouchers/${id}/edit`);
      return;
    }

    try {
      await apiClient.post(`/vouchers/${id}/submit`, {
        employeeSignatureUrl: voucher.employeeSignatureUrl,
      });
      fetchVoucher();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to submit voucher');
    }
  };

  const handleApprove = async () => {
    if (!directorSignatureUrl) {
      setActionError('Director signature is mandatory before approving a voucher');
      return;
    }

    try {
      setIsProcessingAction(true);
      setActionError(null);
      await apiClient.post(`/vouchers/${id}/approve`, {
        directorSignatureUrl,
      });
      setShowApproveModal(false);
      fetchVoucher();
    } catch (err: any) {
      setActionError(err.response?.data?.error?.message || 'Failed to approve voucher');
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason || rejectionReason.trim().length === 0) {
      setActionError('Rejection reason is mandatory when rejecting a voucher');
      return;
    }

    try {
      setIsProcessingAction(true);
      setActionError(null);
      await apiClient.post(`/vouchers/${id}/reject`, {
        rejectionReason,
      });
      setShowRejectModal(false);
      fetchVoucher();
    } catch (err: any) {
      setActionError(err.response?.data?.error?.message || 'Failed to reject voucher');
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center text-slate-500 flex flex-col items-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-2" />
        <span className="text-xs font-medium">Loading voucher details...</span>
      </div>
    );
  }

  if (errorMsg || !voucher) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto" />
        <h3 className="text-lg font-bold text-rose-900">Voucher Not Found</h3>
        <p className="text-xs text-rose-700">{errorMsg || 'The requested voucher does not exist or you do not have permission to view it.'}</p>
        <button
          onClick={() => navigate('/vouchers')}
          className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700"
        >
          Return to Voucher List
        </button>
      </div>
    );
  }

  const role = user?.role;
  const isOwner = user?.id === voucher.employeeId;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Print Control (Hidden during print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate('/vouchers')}
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
                {voucher.voucherNumber}
              </h2>
              <StatusBadge status={voucher.status} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Created on {formatDate(voucher.createdAt)} • Last updated {formatDateTime(voucher.updatedAt)}
            </p>
          </div>
        </div>

        {/* Action Buttons Header */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition shadow-sm"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            Print / PDF
          </button>

          {/* Employee Draft Controls */}
          {role === 'EMPLOYEE' && isOwner && voucher.status === 'DRAFT' && (
            <>
              <Link
                to={`/vouchers/${voucher.id}/edit`}
                className="inline-flex items-center px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
              >
                <Edit className="w-4 h-4 mr-1.5" />
                Edit Draft
              </Link>
              <button
                onClick={handleSubmitDraft}
                className="inline-flex items-center px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl transition shadow-sm"
              >
                <Send className="w-4 h-4 mr-1.5" />
                Submit
              </button>
              <button
                onClick={handleDeleteDraft}
                className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition"
                title="Delete Draft"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Director Approval Controls */}
          {role === 'DIRECTOR' && voucher.status === 'PENDING_APPROVAL' && (
            <>
              <button
                onClick={() => {
                  setActionError(null);
                  setShowRejectModal(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition"
              >
                <XCircle className="w-4 h-4 mr-1.5" />
                Reject
              </button>
              <button
                onClick={() => {
                  setActionError(null);
                  setShowApproveModal(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-md shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Approve
              </button>
            </>
          )}
        </div>
      </div>

      {/* Rejection Reason Alert if rejected */}
      {voucher.status === 'REJECTED' && voucher.rejectionReason && (
        <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-900">
          <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Voucher Rejected by Director</h4>
            <p className="text-xs font-semibold mt-1 bg-white p-3 rounded-xl border border-rose-200 text-rose-800">
              "{voucher.rejectionReason}"
            </p>
          </div>
        </div>
      )}

      {/* Printable Official Voucher Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden print:shadow-none print:border-none print:p-0">
        {/* Printable Voucher Top Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight">ABC COMPANY</h1>
            <p className="text-xs text-slate-300">Official Expense Reimbursement Voucher</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-mono block">VOUCHER NUMBER</span>
            <span className="text-lg font-extrabold font-mono text-brand-300">{voucher.voucherNumber}</span>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Basic Information Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pb-1 border-b border-slate-100">
              1. Basic Expense Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Voucher Date</span>
                <span className="text-sm font-semibold text-slate-800 flex items-center mt-0.5">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {formatDate(voucher.voucherDate)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Expense Date</span>
                <span className="text-sm font-semibold text-slate-800 flex items-center mt-0.5">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {formatDate(voucher.expenseDate)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Department</span>
                <span className="text-sm font-semibold text-slate-800 flex items-center mt-0.5">
                  <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {voucher.department}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Total Amount Claimed</span>
                <span className="text-lg font-black text-brand-700 flex items-center mt-0.5">
                  {formatCurrency(voucher.amount)}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Expense Title</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{voucher.expenseTitle}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Category</span>
                <span className="text-sm font-semibold text-slate-700 mt-0.5 block">{voucher.expenseCategory}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-[11px] text-slate-400 font-medium block">Description & Business Purpose</span>
                <p className="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed">
                  {voucher.expenseDescription || 'No description provided.'}
                </p>
              </div>
            </div>
          </div>

          {/* Employee Information Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pb-1 border-b border-slate-100">
              2. Employee Information & Signature
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">Employee Name</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center mt-0.5">
                    <User className="w-4 h-4 mr-1.5 text-slate-400" />
                    {voucher.employee.name}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">Employee ID</span>
                  <span className="text-xs font-mono font-semibold text-slate-700">
                    {voucher.employee.employeeId || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">Email Address</span>
                  <span className="text-xs text-slate-600">{voucher.employee.email}</span>
                </div>
              </div>

              {/* Employee Signature Image Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Employee Signature
                </span>
                {voucher.employeeSignatureUrl ? (
                  <div className="h-20 flex items-center justify-center bg-white p-2 rounded-lg border border-slate-200">
                    <img
                      src={voucher.employeeSignatureUrl}
                      alt="Employee Signature"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-20 flex items-center justify-center text-xs text-slate-400 italic bg-white rounded-lg border border-slate-200">
                    Signature Pending (Required for Submission)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Approval Information Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pb-1 border-b border-slate-100">
              3. Director Approval & Sign-Off
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">Current Approval Status</span>
                  <div className="mt-1">
                    <StatusBadge status={voucher.status} />
                  </div>
                </div>
                {voucher.director && (
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Reviewed By</span>
                    <span className="text-sm font-bold text-slate-900 flex items-center mt-0.5">
                      <ShieldCheck className="w-4 h-4 mr-1.5 text-purple-600" />
                      {voucher.director.name}
                    </span>
                  </div>
                )}
                {voucher.approvalDate && (
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Approval Date</span>
                    <span className="text-xs font-semibold text-emerald-800">
                      {formatDateTime(voucher.approvalDate)}
                    </span>
                  </div>
                )}
              </div>

              {/* Director Signature Image Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Director Authorization Signature
                </span>
                {voucher.directorSignatureUrl ? (
                  <div className="h-20 flex items-center justify-center bg-white p-2 rounded-lg border border-slate-200">
                    <img
                      src={voucher.directorSignatureUrl}
                      alt="Director Signature"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-20 flex items-center justify-center text-xs text-slate-400 italic bg-white rounded-lg border border-slate-200">
                    {voucher.status === 'APPROVED' ? 'Signed' : 'Awaiting Director Sign-Off'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Audit Information */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 text-[11px] text-slate-400 flex flex-col sm:flex-row justify-between items-center">
          <span>System ID: {voucher.id}</span>
          <span>Created: {formatDateTime(voucher.createdAt)} • Updated: {formatDateTime(voucher.updatedAt)}</span>
        </div>
      </div>

      {/* APPROVE MODAL FOR DIRECTOR */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2" />
              Approve Expense Voucher
            </h3>
            <p className="text-xs text-slate-600">
              You are approving voucher <span className="font-mono font-bold">{voucher.voucherNumber}</span> for{' '}
              <span className="font-bold">{formatCurrency(voucher.amount)}</span>. Please attach your Director signature before confirming.
            </p>

            {actionError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {actionError}
              </div>
            )}

            <SignaturePad
              label="Director Signature (Mandatory)"
              onSignatureChange={(url) => setDirectorSignatureUrl(url)}
            />

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingAction}
                onClick={handleApprove}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                {isProcessingAction ? 'Approving...' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL FOR DIRECTOR */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 flex items-center text-rose-600">
              <XCircle className="w-5 h-5 mr-2" />
              Reject Expense Voucher
            </h3>
            <p className="text-xs text-slate-600">
              You are rejecting voucher <span className="font-mono font-bold">{voucher.voucherNumber}</span>. Please state the mandatory rejection reason.
            </p>

            {actionError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {actionError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Rejection Remarks / Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Missing receipt documentation or exceeds policy per-head limit..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingAction}
                onClick={handleReject}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                {isProcessingAction ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
