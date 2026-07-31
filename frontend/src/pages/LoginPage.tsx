import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Receipt,
  ShieldCheck,
  UserCheck,
  CreditCard,
  Lock,
  Mail,
  ArrowRight,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginAsDemoRole = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    try {
      setIsSubmitting(true);
      setError(null);
      await login(demoEmail, demoPass);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Demo authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2f6] flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Centered White Card */}
      <div className="w-full max-w-[420px] bg-white p-8 lg:p-9 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 space-y-6">
        
        {/* Brand Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#0f172a] text-white flex items-center justify-center shadow-sm flex-shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-[#0f172a] tracking-tight leading-none">ABC COMPANY</h1>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Expense Voucher Management System</p>
          </div>
        </div>

        {/* Title */}
        <div className="pt-2">
          <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">System Login</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
            Enter your work email address and password to sign in to your portal.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold leading-relaxed">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              WORK EMAIL ADDRESS
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@abc.com"
                className="block w-full pl-10 pr-4 py-3 bg-[#f1f5f9] border border-transparent rounded-xl text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:border-slate-300 transition font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              PASSWORD
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="block w-full pl-10 pr-4 py-3 bg-[#f1f5f9] border border-transparent rounded-xl text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:border-slate-300 transition font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl text-xs font-bold text-white bg-[#0f172a] hover:bg-[#1e293b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 shadow-md shadow-slate-900/10 transition disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Accounts Selection */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider text-center">
            FAST DEMO ACCOUNTS QUICK SIGN-IN
          </span>

          <div className="grid grid-cols-3 gap-2">
            {/* Employee Account Card */}
            <button
              type="button"
              onClick={() => loginAsDemoRole('employee@abc.com', 'Employee@123')}
              disabled={isSubmitting}
              className="p-2.5 bg-[#f8fafc] hover:bg-slate-100 border border-slate-200/80 rounded-xl transition text-left group"
            >
              <div className="flex items-center space-x-1 mb-0.5">
                <UserCheck className="w-3 h-3 text-slate-600" />
                <span className="text-[11px] font-bold text-slate-900 truncate">Rajesh</span>
              </div>
              <span className="text-[9px] font-semibold text-slate-500 block truncate">Employee</span>
            </button>

            {/* Director Account Card */}
            <button
              type="button"
              onClick={() => loginAsDemoRole('director@abc.com', 'Director@123')}
              disabled={isSubmitting}
              className="p-2.5 bg-[#f8fafc] hover:bg-purple-50 border border-slate-200/80 hover:border-purple-300 rounded-xl transition text-left group"
            >
              <div className="flex items-center space-x-1 mb-0.5">
                <ShieldCheck className="w-3 h-3 text-purple-600" />
                <span className="text-[11px] font-bold text-slate-900 truncate">V. Mehta</span>
              </div>
              <span className="text-[9px] font-semibold text-slate-500 block truncate">Director</span>
            </button>

            {/* Accounts Team Card */}
            <button
              type="button"
              onClick={() => loginAsDemoRole('accounts@abc.com', 'Accounts@123')}
              disabled={isSubmitting}
              className="p-2.5 bg-[#f8fafc] hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 rounded-xl transition text-left group"
            >
              <div className="flex items-center space-x-1 mb-0.5">
                <CreditCard className="w-3 h-3 text-emerald-600" />
                <span className="text-[11px] font-bold text-slate-900 truncate">Sneha</span>
              </div>
              <span className="text-[9px] font-semibold text-slate-500 block truncate">Accounts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
