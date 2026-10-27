import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock, Eye, Check } from 'lucide-react';
import { getSeverityColor, formatDate } from '../utils/formatters';

export default function IncidentTable({ incidents, onSelectIncident, onResolveIncident }) {
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = incidents.filter((inc) => {
    const matchSev = severityFilter === 'ALL' || inc.severity === severityFilter;
    const matchStat = statusFilter === 'ALL' || inc.status === statusFilter;
    return matchSev && matchStat;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h3 className="text-sm font-bold text-white">Incident Feed & Live Outages</h3>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {filtered.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="P0">P0 - Critical Outage</option>
            <option value="P1">P1 - Major Impact</option>
            <option value="P2">P2 - Degraded</option>
            <option value="P3">P3 - Minor / Info</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Severity</th>
              <th className="px-5 py-3.5">Incident Number</th>
              <th className="px-5 py-3.5">Title & Root Cause</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Duration</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                  No active incidents recorded. Systems operating within SLA parameters.
                </td>
              </tr>
            ) : (
              filtered.map((inc) => {
                const isInvestigating = inc.status === 'INVESTIGATING';
                return (
                  <tr
                    key={inc.id}
                    onClick={() => onSelectIncident(inc)}
                    className="hover:bg-slate-850 cursor-pointer transition"
                  >
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getSeverityColor(inc.severity)}`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-white">
                      {inc.incident_number}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-100">{inc.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{inc.root_cause_summary}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isInvestigating
                          ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {inc.duration_minutes ? `${inc.duration_minutes}m` : 'Ongoing'}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIncident(inc);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                      >
                        Inspect War Room
                      </button>
                      {isInvestigating && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onResolveIncident(inc.id);
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
