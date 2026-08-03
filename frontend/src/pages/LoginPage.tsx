import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Receipt,
  ShieldCheck,
  UserCheck,
  CreditCard,
  Lock,
  Mail,
  ArrowRight,
  User,
  Briefcase,
  UserPlus,
  LogIn,
  CheckCircle2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialTab = searchParams.get('tab') === 'register' ? 'REGISTER' : 'LOGIN';
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialTab);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmpId, setRegEmpId] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
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
      setError(err.response?.data?.error?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setError('Please fill in your full name, email address, and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        employeeId: regEmpId || undefined,
      });
      setSuccessMsg('Employee account created successfully! Redirecting to your dashboard...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed. Please try again.');
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
    <div className="min-h-screen bg-[#f1f5f9] bg-[radial-gradient(#cbd5e1_1.2px,transparent_1.2px)] [background-size:28px_28px] flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      {/* Decorative ambient glowing gradient orbs */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/25 via-sky-400/20 to-purple-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-amber-400/20 via-emerald-400/20 to-brand-500/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Side Floating Badge (Left) - Desktop */}
      <div className="hidden xl:flex absolute left-12 top-1/2 -translate-y-1/2 bg-white/85 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xl max-w-[260px] space-x-3 items-center z-10 animate-fade-in">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-black text-slate-900">Institutional Governance</div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">SEBI Registered • 100% Statutory Audit Compliant</div>
        </div>
      </div>

      {/* Side Floating Badge (Right) - Desktop */}
      <div className="hidden xl:flex absolute right-12 top-1/2 -translate-y-1/2 bg-white/85 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xl max-w-[260px] space-x-3 items-center z-10 animate-fade-in">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-black text-slate-900">Digital E-Signatures</div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">Dual Employee & Director Approval Authorization</div>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[460px] bg-white/95 backdrop-blur-xl p-8 sm:p-9 rounded-3xl shadow-2xl shadow-slate-300/70 border border-white/80 space-y-6 relative z-10 animate-fade-in">

        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-brand-600/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <Receipt className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-black text-slate-900 tracking-tight leading-none">PRACHAY</span>
                <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded uppercase">GROUP</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Expense Voucher System</p>
            </div>
          </Link>

          <Link
            to="/"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1.5 rounded-xl border border-brand-200/70 transition"
          >
            Company Home
          </Link>
        </div>

        {/* Mode Switcher Tabs (Sign In vs Create Account) */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex space-x-1">
          <button
            type="button"
            onClick={() => { setMode('LOGIN'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              mode === 'LOGIN'
                ? 'bg-white text-slate-900 shadow-md shadow-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('REGISTER'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              mode === 'REGISTER'
                ? 'bg-white text-brand-700 shadow-md shadow-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Employee Account</span>
          </button>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold leading-relaxed">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* FORM MODE: SIGN IN */}
        {mode === 'LOGIN' && (
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
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
                  className="block w-full pl-10 pr-4 py-3 bg-[#f1f5f9] border border-transparent rounded-xl text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:border-brand-300 transition font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
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
                  className="block w-full pl-10 pr-4 py-3 bg-[#f1f5f9] border border-transparent rounded-xl text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:border-brand-300 transition font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-brand-700 to-brand-600 hover:from-brand-800 hover:to-brand-700 shadow-md shadow-brand-700/20 transition disabled:opacity-50 mt-2"
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
        )}

        {/* FORM MODE: REGISTER EMPLOYEE */}
        {mode === 'REGISTER' && (
          <form className="space-y-3.5" onSubmit={handleRegisterSubmit}>
            <div className="p-3 bg-brand-50/70 border border-brand-200/60 rounded-xl text-[11px] text-brand-900 font-medium">
              Create your official Employee profile to submit expense vouchers & track approvals.
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                FULL NAME <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  placeholder="e.g. Vikram Sharma"
                  className="block w-full pl-10 pr-4 py-2.5 bg-[#f1f5f9] border border-transparent rounded-xl text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:border-brand-300 transition font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                WORK EMAIL ADDRESS <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  placeholder="vikram@abc.com"
                  className="block w-full pl-10 pr-4 py-2.5 bg-[#f1f5f9] border border-transparent rounded-xl text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:border-brand-300 transition font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                EMPLOYEE ID <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={regEmpId}
                  onChange={(e) => setRegEmpId(e.target.value)}
                  placeholder="e.g. EMP-105"
                  className="block w-full pl-10 pr-4 py-2.5 bg-[#f1f5f9] border border-transparent rounded-xl text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:border-brand-300 transition font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                PASSWORD <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-2.5 bg-[#f1f5f9] border border-transparent rounded-xl text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:border-brand-300 transition font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 transition disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Employee Profile & Sign In <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </>
              )}
            </button>
          </form>
        )}

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
              className="p-2.5 bg-sky-50/60 hover:bg-sky-100/80 border border-sky-200/80 rounded-xl transition text-left group"
            >
              <div className="flex items-center space-x-1.5 mb-0.5">
                <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                <span className="text-[11px] font-extrabold text-slate-900 truncate">Rajesh</span>
              </div>
              <span className="text-[9px] font-bold text-sky-700 block truncate">Employee</span>
            </button>

            {/* Director Account Card */}
            <button
              type="button"
              onClick={() => loginAsDemoRole('director@abc.com', 'Director@123')}
              disabled={isSubmitting}
              className="p-2.5 bg-purple-50/60 hover:bg-purple-100/80 border border-purple-200/80 rounded-xl transition text-left group"
            >
              <div className="flex items-center space-x-1.5 mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-[11px] font-extrabold text-slate-900 truncate">V. Mehta</span>
              </div>
              <span className="text-[9px] font-bold text-purple-700 block truncate">Director</span>
            </button>

            {/* Accounts Team Card */}
            <button
              type="button"
              onClick={() => loginAsDemoRole('accounts@abc.com', 'Accounts@123')}
              disabled={isSubmitting}
              className="p-2.5 bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-xl transition text-left group"
            >
              <div className="flex items-center space-x-1.5 mb-0.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-extrabold text-slate-900 truncate">Sneha</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-700 block truncate">Accounts</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
