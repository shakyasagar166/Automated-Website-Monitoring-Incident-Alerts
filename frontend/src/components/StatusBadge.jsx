import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, PauseCircle } from 'lucide-react';
import { getStatusColor } from '../utils/formatters';

export default function StatusBadge({ status }) {
  const getIcon = () => {
    switch (status) {
      case 'UP':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'DEGRADED':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />;
      case 'DOWN':
        return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <PauseCircle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusColor(status)}`}>
      {getIcon()}
      <span>{status || 'UNKNOWN'}</span>
    </span>
  );
}
