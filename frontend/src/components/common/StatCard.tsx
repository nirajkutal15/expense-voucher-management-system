import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'amber' | 'emerald' | 'rose' | 'slate' | 'purple';
  subtitle?: string;
}

const colorMap: Record<StatCardProps['color'], {
  cardBg: string;
  borderColor: string;
  iconBg: string;
  iconText: string;
  titleText: string;
  valueText: string;
}> = {
  blue: {
    cardBg: 'bg-gradient-to-br from-sky-50/80 to-white',
    borderColor: 'border-sky-200/90 hover:border-sky-400',
    iconBg: 'bg-sky-500 text-white shadow-md shadow-sky-500/20',
    iconText: 'text-white',
    titleText: 'text-sky-700',
    valueText: 'text-sky-950',
  },
  amber: {
    cardBg: 'bg-gradient-to-br from-amber-50/80 to-white',
    borderColor: 'border-amber-200/90 hover:border-amber-400',
    iconBg: 'bg-amber-500 text-white shadow-md shadow-amber-500/20',
    iconText: 'text-white',
    titleText: 'text-amber-800',
    valueText: 'text-amber-950',
  },
  emerald: {
    cardBg: 'bg-gradient-to-br from-emerald-50/80 to-white',
    borderColor: 'border-emerald-200/90 hover:border-emerald-400',
    iconBg: 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20',
    iconText: 'text-white',
    titleText: 'text-emerald-800',
    valueText: 'text-emerald-950',
  },
  rose: {
    cardBg: 'bg-gradient-to-br from-rose-50/80 to-white',
    borderColor: 'border-rose-200/90 hover:border-rose-400',
    iconBg: 'bg-rose-500 text-white shadow-md shadow-rose-500/20',
    iconText: 'text-white',
    titleText: 'text-rose-800',
    valueText: 'text-rose-950',
  },
  purple: {
    cardBg: 'bg-gradient-to-br from-purple-50/80 to-white',
    borderColor: 'border-purple-200/90 hover:border-purple-400',
    iconBg: 'bg-purple-500 text-white shadow-md shadow-purple-500/20',
    iconText: 'text-white',
    titleText: 'text-purple-800',
    valueText: 'text-purple-950',
  },
  slate: {
    cardBg: 'bg-white',
    borderColor: 'border-slate-200 hover:border-slate-300',
    iconBg: 'bg-slate-700 text-white shadow-md shadow-slate-700/10',
    iconText: 'text-white',
    titleText: 'text-slate-500',
    valueText: 'text-slate-900',
  },
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtitle }) => {
  const c = colorMap[color];

  return (
    <div className={`rounded-2xl border ${c.borderColor} ${c.cardBg} p-5 shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={`text-[11px] font-extrabold uppercase tracking-wider ${c.titleText}`}>{title}</p>
          <h3 className={`text-2xl font-black ${c.valueText}`}>{value}</h3>
          {subtitle && <p className="text-[11px] text-slate-500 font-medium pt-0.5">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl ${c.iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5.5 h-5.5 stroke-[2.2]" />
        </div>
      </div>
    </div>
  );
};
