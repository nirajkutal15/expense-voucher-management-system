import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Receipt, Home } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleMeta = (role?: string) => {
    switch (role) {
      case 'EMPLOYEE':
        return {
          label: 'Employee',
          badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
          dot: 'bg-sky-500',
          avatarGrad: 'from-sky-600 to-blue-700',
        };
      case 'DIRECTOR':
        return {
          label: 'Director (Admin)',
          badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
          avatarGrad: 'from-purple-600 to-indigo-700',
        };
      case 'ACCOUNTS':
        return {
          label: 'Accounts Team',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          avatarGrad: 'from-emerald-600 to-teal-700',
        };
      default:
        return {
          label: 'User',
          badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
          dot: 'bg-slate-500',
          avatarGrad: 'from-slate-600 to-slate-800',
        };
    }
  };

  const roleMeta = getRoleMeta(user?.role);

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-6 shadow-sm">
      {/* Brand Logo & Title */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-amber-500 flex items-center justify-center text-white font-bold shadow-md shadow-brand-600/20 group-hover:scale-105 transition-transform">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-slate-900 text-base tracking-tight leading-none">PRACHAY</span>
              <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded uppercase tracking-wider">GROUP</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Expense Voucher System</p>
          </div>
        </Link>

        {/* Quick Landing Page link */}
        <Link
          to="/"
          className="hidden md:inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-brand-600 bg-slate-100/80 hover:bg-brand-50 px-2.5 py-1.5 rounded-lg border border-slate-200/70 transition-all"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Company Portal</span>
        </Link>
      </div>

      {/* User Section (Right Side) */}
      {user && (
        <div className="flex items-center space-x-3">
          {/* User Profile Card */}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-slate-50 to-slate-100/80 border border-slate-200/90 rounded-2xl p-1.5 pr-4 shadow-sm hover:shadow transition-shadow">
            {/* Avatar Circle */}
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${roleMeta.avatarGrad} text-white flex items-center justify-center font-extrabold text-sm shadow-sm`}>
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* User Details */}
            <div className="text-left space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold text-slate-900 leading-none">{user.name}</span>
                <span className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${roleMeta.badgeBg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${roleMeta.dot}`} />
                  <span>{roleMeta.label}</span>
                </span>
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-slate-500 font-medium leading-none">
                <span>{user.email}</span>
                {user.employeeId && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-slate-700 font-bold">{user.employeeId}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 px-3.5 py-2 rounded-xl transition-all shadow-sm hover:shadow"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};
