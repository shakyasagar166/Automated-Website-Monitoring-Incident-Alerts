import React from 'react';
import { Radio, CheckCircle2, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function StatusPages({ monitors }) {
  const hasDown = monitors.some((m) => m.status === 'DOWN');
  const hasDegraded = monitors.some((m) => m.status === 'DEGRADED');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Banner */}
      <div className={`p-8 rounded-3xl border text-center shadow-2xl ${
        hasDown
          ? 'bg-rose-950/40 border-rose-800'
          : hasDegraded
          ? 'bg-amber-950/40 border-amber-800'
          : 'bg-emerald-950/40 border-emerald-800'
      }`}>
        <div className="inline-flex p-3 rounded-2xl bg-slate-900 border border-slate-800 mb-3">
          {hasDown ? (
            <AlertTriangle className="w-8 h-8 text-rose-400" />
          ) : (
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          {hasDown
            ? 'Partial Service Disruption Detected'
            : hasDegraded
            ? 'Minor System Latency Under Investigation'
            : 'All Systems Operational'}
        </h1>
        <p className="text-xs text-slate-400 mt-2">
          Real-time synthetic probing verified from 3 global edge regions.
        </p>
      </div>

      {/* Services List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Core Infrastructure Components
        </h2>

        <div className="space-y-3">
          {monitors.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <h3 className="text-sm font-bold text-white">{m.name}</h3>
                <span className="text-[11px] text-slate-500 font-mono">{m.url}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-300">{m.uptime_percentage}% uptime</span>
                <StatusBadge status={m.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
