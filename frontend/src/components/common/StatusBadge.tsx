import React from 'react';
import { VoucherStatus } from '../../types';
import { getStatusBadgeStyle } from '../../utils/formatters';

interface StatusBadgeProps {
  status: VoucherStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const style = getStatusBadgeStyle(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.bg}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75"></span>
      {style.label}
    </span>
  );
};
