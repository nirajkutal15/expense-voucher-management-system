import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'amber' | 'emerald' | 'rose' | 'slate' | 'purple';
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorStyles = {
    blue: 'bg-sky-50 border-sky-200 text-sky-700 icon-bg:bg-sky-500',
    amber: 'bg-amber-50 border-amber-200 text-amber-700 icon-bg:bg-amber-500',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700 icon-bg:bg-emerald-500',
    rose: 'bg-rose-50 border-rose-200 text-rose-700 icon-bg:bg-rose-500',
    purple: 'bg-purple-50 border-purple-200 text-purple-700 icon-bg:bg-purple-500',
    slate: 'bg-slate-50 border-slate-200 text-slate-700 icon-bg:bg-slate-500',
  };

  const currentStyle = colorStyles[color];

  return (
    <div className={`p-5 rounded-2xl border ${currentStyle} bg-white shadow-sm hover:shadow-md transition`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md bg-current`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};
