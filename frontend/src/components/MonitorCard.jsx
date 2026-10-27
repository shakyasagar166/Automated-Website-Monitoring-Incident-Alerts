import React from 'react';
import StatusBadge from './StatusBadge';
import { 
  Globe, 
  Clock, 
  Lock, 
  Play, 
  AlertOctagon, 
  ExternalLink,
  Zap,
  TrendingUp
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function MonitorCard({ 
  monitor, 
  onSelectMonitor, 
  onCheckNow, 
  onTriggerOutage,
  isChecking 
}) {
  return (
    <div 
      onClick={() => onSelectMonitor(monitor)}
      className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <StatusBadge status={monitor.status} />
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono">
              HTTP {monitor.last_status_code}
            </span>
          </div>
        </div>

        <h3 className="text-base font-bold text-white mb-1 line-clamp-1">
          {monitor.name}
        </h3>
        <p className="text-xs text-slate-400 font-mono mb-3 truncate flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{monitor.url}</span>
        </p>

        <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-4 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Uptime (30d)</span>
            <span className="font-extrabold text-emerald-400">{monitor.uptime_percentage}%</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Avg Latency</span>
            <span className="font-extrabold text-slate-200">{monitor.avg_response_time_ms} ms</span>
          </div>
        </div>

        {/* SSL Badge */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2">
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>SSL Valid ({monitor.ssl_days_remaining}d remaining)</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
        <span className="text-[10px] text-slate-500">
          Checked {formatDate(monitor.last_checked_at)}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCheckNow(monitor.id);
            }}
            disabled={isChecking}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
            title="Probe Now"
          >
            <Play className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onTriggerOutage(monitor.id);
            }}
            className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg text-[10px] font-bold transition flex items-center gap-1"
            title="Simulate Outage & Trigger SRE AI War Room"
          >
            <AlertOctagon className="w-3 h-3 text-rose-400" />
            <span>Simulate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
