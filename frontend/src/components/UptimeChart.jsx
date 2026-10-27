import React from 'react';
import { Activity, Clock } from 'lucide-react';

export default function UptimeChart({ checks = [] }) {
  // Generate 20 recent simulated ping data points if none provided
  const points = checks.length > 0 ? checks : [
    { id: 1, latency: 112, status: 'UP' },
    { id: 2, latency: 120, status: 'UP' },
    { id: 3, latency: 115, status: 'UP' },
    { id: 4, latency: 140, status: 'UP' },
    { id: 5, latency: 135, status: 'UP' },
    { id: 6, latency: 280, status: 'DEGRADED' },
    { id: 7, latency: 130, status: 'UP' },
    { id: 8, latency: 125, status: 'UP' },
    { id: 9, latency: 118, status: 'UP' },
    { id: 10, latency: 122, status: 'UP' },
    { id: 11, latency: 124, status: 'UP' },
    { id: 12, latency: 310, status: 'DEGRADED' },
    { id: 13, latency: 119, status: 'UP' },
    { id: 14, latency: 115, status: 'UP' },
    { id: 15, latency: 110, status: 'UP' },
    { id: 16, latency: 112, status: 'UP' },
    { id: 17, latency: 118, status: 'UP' },
    { id: 18, latency: 121, status: 'UP' },
    { id: 19, latency: 114, status: 'UP' },
    { id: 20, latency: 116, status: 'UP' },
  ];

  const maxLatency = Math.max(...points.map((p) => p.latency || p.response_time_ms || 100), 400);

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          Synthetic Probe Latency History (Last 20 Checks)
        </h3>
        <span className="text-xs font-mono text-emerald-400 font-bold">Avg ~124ms</span>
      </div>

      <div className="h-32 flex items-end gap-1.5 pt-4 border-b border-slate-800/80">
        {points.map((pt, idx) => {
          const lat = pt.latency || pt.response_time_ms || 120;
          const heightPct = Math.min(100, Math.max(12, Math.round((lat / maxLatency) * 100)));
          const isSlow = lat > 250;
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center group relative cursor-pointer"
            >
              <div
                className={`w-full rounded-t transition-all ${
                  isSlow ? 'bg-amber-400 hover:bg-amber-300' : 'bg-emerald-500 hover:bg-emerald-400'
                }`}
                style={{ height: `${heightPct}%` }}
              />
              {/* Tooltip */}
              <div className="absolute -top-8 hidden group-hover:block px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] font-mono text-white z-10 whitespace-nowrap">
                {lat} ms
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
        <span>20 checks ago</span>
        <span>Current probe</span>
      </div>
    </div>
  );
}
