import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const baseNavClass =
    'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors';
  const activeNavClass =
    'bg-brand-50 text-brand-700 font-semibold border-l-4 border-brand-600 shadow-sm';
  const inactiveNavClass = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
            Navigation Menu
          </p>
          <nav className="space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${baseNavClass} ${isActive ? activeNavClass : inactiveNavClass}`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            {/* Employee Specific Links */}
            {role === 'EMPLOYEE' && (
              <>
                <NavLink
                  to="/vouchers/create"
                  className={({ isActive }) =>
                    `${baseNavClass} ${isActive ? activeNavClass : inactiveNavClass}`
                  }
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Voucher</span>
                </NavLink>

                <NavLink
                  to="/vouchers"
                  end
                  className={({ isActive }) =>
                    `${baseNavClass} ${isActive ? activeNavClass : inactiveNavClass}`
                  }
                >
                  <FileText className="w-4 h-4" />
                  <span>My Vouchers</span>
                </NavLink>
              </>
            )}

            {/* Director Specific Links */}
            {role === 'DIRECTOR' && (
              <>
                <NavLink
                  to="/vouchers?status=PENDING_APPROVAL"
                  className={({ isActive }) =>
                    `${baseNavClass} ${isActive ? activeNavClass : inactiveNavClass}`
                  }
                >
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Pending Approvals</span>
                </NavLink>

                <NavLink
                  to="/vouchers"
                  end
                  className={({ isActive }) =>
                    `${baseNavClass} ${isActive ? activeNavClass : inactiveNavClass}`
                  }
                >
                  <Layers className="w-4 h-4" />
                  <span>All Organization Vouchers</span>
                </NavLink>
              </>
            )}

            {/* Accounts Specific Links */}
            {role === 'ACCOUNTS' && (
              <>
                <NavLink
                  to="/vouchers"
                  end
                  className={({ isActive }) =>
                    `${baseNavClass} ${isActive ? activeNavClass : inactiveNavClass}`
                  }
                >
                  <Layers className="w-4 h-4" />
                  <span>All Organization Vouchers</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <span className="text-[11px] font-semibold text-slate-400 block uppercase">Role Permissions</span>
        <p className="text-xs text-slate-600 font-medium mt-1">
          {role === 'EMPLOYEE' && 'Can create drafts, upload signature, submit, & track own vouchers.'}
          {role === 'DIRECTOR' && 'Can view, search, approve (with signature), & reject (with reason) all vouchers.'}
          {role === 'ACCOUNTS' && 'Can monitor, search, filter, & print all organization vouchers.'}
        </p>
      </div>
    </aside>
  );
};
