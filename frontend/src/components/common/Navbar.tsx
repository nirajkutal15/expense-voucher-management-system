import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Receipt } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'EMPLOYEE':
        return <span className="bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-0.5 rounded-md">Employee</span>;
      case 'DIRECTOR':
        return <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-md">Director (Admin)</span>;
      case 'ACCOUNTS':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-md">Accounts Team</span>;
      default:
        return null;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20">
          <Receipt className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-slate-900 text-base tracking-tight leading-none">ABC Company</h1>
          <p className="text-xs text-slate-500 font-medium">Expense Voucher Management System</p>
        </div>
      </div>

      {user && (
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-800">{user.name}</span>
                {getRoleBadge(user.role)}
              </div>
              <span className="text-[11px] text-slate-500 block">{user.email}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-2 rounded-lg transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};
