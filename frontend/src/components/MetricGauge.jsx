import React from 'react';

export default function MetricGauge({ label, value, unit = '', color = 'text-emerald-400', subtext }) {
  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
        {label}
      </span>
      <div className={`text-2xl font-black ${color}`}>
        {value}
        {unit && <span className="text-xs font-normal text-slate-400 ml-1">{unit}</span>}
      </div>
      {subtext && <div className="text-[11px] text-slate-400 mt-1">{subtext}</div>}
    </div>
  );
}
