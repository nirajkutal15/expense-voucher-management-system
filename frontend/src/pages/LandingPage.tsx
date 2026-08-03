import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  ShieldCheck,
  UserCheck,
  LayoutDashboard,
  CreditCard,
  MapPin,
  BarChart3,
  Sparkles,
  PenTool,
  CheckCircle2,
  Printer,
  ChevronRight,
  UserPlus,
  Receipt,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'SIGNATURE' | 'APPROVAL' | 'ANALYTICS' | 'PRINT'>('SIGNATURE');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleQuickLogin = async (email: string, pass: string) => {
    try {
      setIsLoggingIn(true);
      await login(email, pass);
      navigate('/dashboard');
    } catch {
      navigate('/login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-500/20 selection:text-indigo-700 overflow-x-hidden">

      {/* Active User Session Banner */}
      {user && (
        <div className="bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Currently logged in as <strong className="text-amber-300">{user.name}</strong> ({user.role})</span>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-1 text-xs font-extrabold bg-white/20 hover:bg-white/30 text-white px-3.5 py-1 rounded-lg transition"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ─── TOP ANNOUNCEMENT BAR ─── */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-medium py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse mr-1" />
              SEBI Registered Institution
            </span>
            <span className="hidden md:inline text-slate-400">
              Prachay Securities Private Limited • CIN: U67120MH2020PTC345678
            </span>
          </div>
          <div className="flex items-center space-x-4 text-xs font-semibold">
            <span className="text-slate-400">Headquarters: BKC Mumbai</span>
            <span className="text-slate-700">|</span>
            <Link to="/login" className="text-indigo-300 hover:text-white font-bold flex items-center">
              <span>Employee Portal Access</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── HEADER / NAVIGATION BAR ─── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">PRACHAY</span>
                <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded uppercase">GROUP</span>
              </div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 block -mt-0.5">PRACHAY SECURITIES PVT LTD</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-bold text-slate-600">
            <a href="#services" className="hover:text-indigo-600 transition-colors">Financial Services</a>
            <a href="#platform" className="hover:text-indigo-600 transition-colors">Voucher Platform</a>
            <a href="#roles" className="hover:text-indigo-600 transition-colors">Role Explorer</a>
            <a href="#security" className="hover:text-indigo-600 transition-colors">Audit Compliance</a>
            <a href="#offices" className="hover:text-indigo-600 transition-colors">Office Hubs</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-indigo-700 px-3.5 py-2 rounded-xl transition-colors hidden sm:block"
                >
                  Sign In
                </Link>
                <Link
                  to="/login?tab=register"
                  className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4.5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </Link>
              </>
            )}
          </div>

        </div>
      </header>


      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-[#f8fafc]">
        {/* Subtle background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 text-center space-y-8">

          {/* Pill Badge */}
          <div className="inline-flex items-center space-x-2.5 bg-indigo-50/80 border border-indigo-200/80 rounded-full px-4.5 py-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-extrabold text-indigo-950">
              Prachay Securities Expense Voucher Management System
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Enterprise Expense Management,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-brand-600">
              Digitized with E-Signatures
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
            Built for <strong className="text-slate-800 font-bold">Prachay Securities Private Limited (PSPL)</strong>. Effortlessly manage 
            reimbursement claims, advance requests, Director digital sign-offs, and Accounts settlement across all departments.
          </p>

          {/* Call To Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center space-x-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Employee Portal Sign-In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login?tab=register"
              className="inline-flex items-center space-x-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-extrabold px-7 py-3.5 rounded-xl transition-all shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-indigo-600" />
              <span>Create Employee Account</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 text-center shadow-sm">
              <div className="text-2xl font-black text-indigo-600">100%</div>
              <div className="text-[11px] font-bold text-slate-500 mt-0.5">Digital Audit Trail</div>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 text-center shadow-sm">
              <div className="text-2xl font-black text-violet-600">&lt; 24 hrs</div>
              <div className="text-[11px] font-bold text-slate-500 mt-0.5">Approval Turnaround</div>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 text-center shadow-sm">
              <div className="text-2xl font-black text-brand-600">Dual Signed</div>
              <div className="text-[11px] font-bold text-slate-500 mt-0.5">Employee & Director</div>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 text-center shadow-sm">
              <div className="text-2xl font-black text-slate-800">SEBI & Tax</div>
              <div className="text-[11px] font-bold text-slate-500 mt-0.5">Audit Ready Export</div>
            </div>
          </div>

        </div>
      </section>


      {/* ─── INTERACTIVE LIVE FEATURE INSPECTOR ─── */}
      <section id="platform" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              Platform Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Interactive System Inspector
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Click below to explore how the Expense Voucher Management Platform operates for Prachay Securities.
            </p>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="flex justify-center">
            <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap gap-1 border border-slate-200/80">
              {[
                { id: 'SIGNATURE', label: 'E-Signature Canvas', icon: PenTool },
                { id: 'APPROVAL', label: 'Director Authorization', icon: ShieldCheck },
                { id: 'ANALYTICS', label: 'Department Analytics', icon: BarChart3 },
                { id: 'PRINT', label: 'Printable Voucher', icon: Printer },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Inspector Content Display */}
          <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-8 shadow-sm">
            {activeTab === 'SIGNATURE' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <PenTool className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">HTML5 Canvas & Image Signature Studio</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Employees can draw signatures directly on an interactive canvas using a stylus or touch device, or upload image files (PNG/JPEG). Uploaded files are validated at the byte-header level for magic byte integrity.
                  </p>
                  <div className="space-y-2 text-xs font-semibold text-slate-700">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Touch & mouse stroke drawing canvas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Magic-byte upload header validation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Saved as PNG data URLs in secure database</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
                  <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Draw Signature Sample</span>
                    <span className="text-[10px] text-indigo-600 font-mono">CANVAS READY</span>
                  </div>
                  <div className="h-32 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden">
                    <svg className="w-48 h-16 text-indigo-600" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M 20 40 Q 40 10 60 30 T 100 20 T 140 40 T 180 15" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Signature verified for Voucher #VCH-20260731-0001</span>
                    <span className="font-bold text-emerald-600">Attached</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'APPROVAL' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">Executive Director Approval Suite</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Directors can inspect claims across Engineering, Sales, HR, and Operations. Approvals require a Director digital sign-off signature, while rejections require mandatory documented feedback.
                  </p>
                  <div className="space-y-2 text-xs font-semibold text-slate-700">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-violet-600" />
                      <span>Pending approval queue filtering</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-violet-600" />
                      <span>Executive digital signature authorization</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Cyber City Q2 Release Dinner</div>
                      <div className="text-[10px] text-slate-500">Claimed by Rajesh Kumar (EMP-101)</div>
                    </div>
                    <span className="text-sm font-black text-indigo-700">₹2,480.00</span>
                  </div>
                  <div className="p-3 bg-violet-50 rounded-xl border border-violet-200 text-xs text-violet-900 font-medium">
                    "Approved by Director Vikramaditya Mehta with signature attached."
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ANALYTICS' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">Department Expense Analytics</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Real-time aggregation of organization expense metrics by department (Engineering, Sales, Accounts), expense category (Software, Travel, Hardware), and claim status.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-3">
                  <div className="text-xs font-bold text-slate-900">Expense Breakdown by Department</div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                        <span>Engineering</span>
                        <span className="text-indigo-700">₹4,820.00</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full w-[60%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                        <span>Sales & Marketing</span>
                        <span className="text-violet-700">₹2,400.00</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-violet-600 h-2 rounded-full w-[30%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'PRINT' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <Printer className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">Official Print & PDF Export</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Generate clean, formatted, print-ready official voucher documents with dual Employee and Director signatures for statutory tax filing and physical audit archives.
                  </p>
                </div>
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-black text-indigo-400">PRACHAY SECURITIES</span>
                    <span className="text-[10px] font-mono text-slate-400">OFFICIAL VOUCHER</span>
                  </div>
                  <div className="text-xs space-y-1 text-slate-300">
                    <div>Voucher #: <span className="font-mono font-bold text-white">VCH-20260731-0010</span></div>
                    <div>Department: <span className="text-white">Engineering</span></div>
                    <div>Amount: <span className="font-bold text-emerald-400">₹2,000.00</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>


      {/* ─── 3-STEP WORKFLOW ─── */}
      <section className="py-20 bg-[#f8fafc] border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-16">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-600 bg-slate-200/60 border border-slate-300/80 px-3 py-1 rounded-full">
              Seamless Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Three Simple Steps to Reimbursement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-lg shadow-md shadow-indigo-600/20">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900">Employee Claims & Signs</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Employee fills in date, department, amount, and title, then draws or uploads their signature to submit the claim.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white font-black flex items-center justify-center text-lg shadow-md shadow-violet-600/20">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900">Director Sign-Off</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Director evaluates the voucher, attaches executive digital signature for authorization, or rejects with feedback.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg shadow-md shadow-emerald-600/20">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900">Accounts Settlement</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Accounts team processes payout, exports CSV records for tax audit, and marks the voucher as REIMBURSED.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ─── ROLE GATEWAYS & FAST DEMO LOGIN ─── */}
      <section id="roles" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full">
              Role Access Explorer
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Test Portals by Role
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Employee */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6 space-y-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Employee Portal</h3>
                  <p className="text-xs text-slate-500 mt-1">Create claims, attach signatures, track live approval status.</p>
                </div>
              </div>
              <button
                disabled={isLoggingIn}
                onClick={() => handleQuickLogin('employee@abc.com', 'Employee@123')}
                className="w-full inline-flex justify-center items-center space-x-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
              >
                <span>Try Rajesh (EMP-101)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Director */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6 space-y-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Director Suite</h3>
                  <p className="text-xs text-slate-500 mt-1">Review pending claims, attach executive sign-off, or reject.</p>
                </div>
              </div>
              <button
                disabled={isLoggingIn}
                onClick={() => handleQuickLogin('director@abc.com', 'Director@123')}
                className="w-full inline-flex justify-center items-center space-x-2 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
              >
                <span>Try V. Mehta (DIR-001)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Accounts */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6 space-y-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Accounts Portal</h3>
                  <p className="text-xs text-slate-500 mt-1">Filter, search, export CSV, print vouchers, process payouts.</p>
                </div>
              </div>
              <button
                disabled={isLoggingIn}
                onClick={() => handleQuickLogin('accounts@abc.com', 'Accounts@123')}
                className="w-full inline-flex justify-center items-center space-x-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
              >
                <span>Try Sneha (ACC-001)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>


      {/* ─── OFFICE HUBS & GOVERNANCE ─── */}
      <section id="offices" className="py-20 bg-[#f8fafc] border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-600 bg-slate-200/80 px-3 py-1 rounded-full">
              Corporate Governance
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Prachay Group Registered Office Hubs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm">
                <MapPin className="w-4 h-4" />
                <span>Mumbai Headquarters</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Bandra-Kurla Complex (BKC), Bandra East, Mumbai, Maharashtra 400051
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center space-x-2 text-violet-700 font-bold text-sm">
                <MapPin className="w-4 h-4" />
                <span>Bengaluru Tech Center</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                EPIP Zone, Whitefield, Bengaluru, Karnataka 560066
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
                <MapPin className="w-4 h-4" />
                <span>Gurugram Hub</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                DLF Cyber City, Phase 2, Gurugram, Haryana 122002
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                  <Receipt className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-white text-sm">Prachay Securities Private Limited</span>
              </div>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                SEBI registered financial services institution delivering equity trading, capital advisory, and automated expense voucher management.
              </p>
            </div>

            <div className="md:col-span-3 space-y-1 text-xs">
              <div className="font-bold text-white uppercase tracking-wider mb-2">Registrations</div>
              <div>SEBI Reg: <span className="text-indigo-400 font-mono">INZ000192837</span></div>
              <div>CIN: <span className="text-indigo-400 font-mono">U67120MH2020PTC345678</span></div>
            </div>

            <div className="md:col-span-3 space-y-1 text-xs">
              <div className="font-bold text-white uppercase tracking-wider mb-2">Portal Access</div>
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold block">
                Sign In to Portal →
              </Link>
              <Link to="/login?tab=register" className="text-emerald-400 hover:text-emerald-300 font-bold block mt-1">
                Create Employee Account →
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-2">
            <span>© 2026 Prachay Securities Private Limited. All rights reserved.</span>
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold">System Operational</span>
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
};
