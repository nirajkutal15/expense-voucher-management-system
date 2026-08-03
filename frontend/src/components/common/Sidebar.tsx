import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Clock,
  Layers,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
      isActive
        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <div className="flex items-center space-x-1.5 px-3 mb-3 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
            <Compass className="w-3 h-3 text-slate-400" />
            <span>Navigation Menu</span>
          </div>

          <nav className="space-y-1.5">
            <NavLink to="/dashboard" className={getLinkClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </NavLink>

            {/* Employee Specific Links */}
            {role === 'EMPLOYEE' && (
              <>
                <NavLink to="/vouchers/create" className={getLinkClass}>
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Voucher</span>
                </NavLink>

                <NavLink to="/vouchers" end className={getLinkClass}>
                  <FileText className="w-4 h-4" />
                  <span>My Expense Claims</span>
                </NavLink>
              </>
            )}

            {/* Director Specific Links */}
            {role === 'DIRECTOR' && (
              <>
                <NavLink to="/vouchers?status=PENDING_APPROVAL" className={getLinkClass}>
                  <Clock className="w-4 h-4" />
                  <span>Pending Approvals</span>
                </NavLink>

                <NavLink to="/vouchers" end className={getLinkClass}>
                  <Layers className="w-4 h-4" />
                  <span>All Vouchers</span>
                </NavLink>
              </>
            )}

            {/* Accounts Specific Links */}
            {role === 'ACCOUNTS' && (
              <NavLink to="/vouchers" end className={getLinkClass}>
                <Layers className="w-4 h-4" />
                <span>All Vouchers</span>
              </NavLink>
            )}
          </nav>
        </div>
      </div>

      {/* Role info card */}
      <div className="p-3.5 bg-gradient-to-br from-slate-50 to-slate-100/90 border border-slate-200 rounded-2xl space-y-1.5">
        <div className="flex items-center space-x-1.5 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider">Portal Access</span>
        </div>
        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
          {role === 'EMPLOYEE' && 'Can create draft vouchers, attach digital signatures, submit, & track claims.'}
          {role === 'DIRECTOR' && 'Can review submissions across departments, sign-off approvals, or reject with reason.'}
          {role === 'ACCOUNTS' && 'Can search, filter, print, export CSV, and issue payout settlements.'}
        </p>
      </div>
    </aside>
  );
};
