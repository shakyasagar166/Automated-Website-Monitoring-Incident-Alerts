import React from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Terminal, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { getSeverityColor, formatDate } from '../utils/formatters';

export default function IncidentDetails({ incident, onResolve, onBack }) {
  if (!incident) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl shadow-xl text-slate-400">
        <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">Select an Incident to Enter SRE War Room</h3>
      </div>
    );
  }

  const isInvestigating = incident.status === 'INVESTIGATING';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col h-full">
      {/* War Room Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-950/70">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${getSeverityColor(incident.severity)}`}>
              {incident.severity} OUTAGE
            </span>
            <span className="font-mono text-xs font-bold text-slate-400">
              {incident.incident_number}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
              isInvestigating ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {incident.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isInvestigating && (
              <button
                onClick={() => onResolve(incident.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition"
              >
                Mark as Resolved
              </button>
            )}
            {onBack && (
              <button
                onClick={onBack}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700"
              >
                Close View
              </button>
            )}
          </div>
        </div>

        <h1 className="text-xl font-black text-white mb-2">
          {incident.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Started: {formatDate(incident.started_at)}
          </span>
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Impact Layer: <strong className="text-slate-200">{incident.affected_components}</strong>
          </span>
        </div>
      </div>

      {/* Diagnostics Body */}
      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        {/* AI Root Cause Hypothesis */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              AI Automated Root Cause Analysis (RCA)
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
              94% Diagnostics Confidence
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {incident.root_cause_summary}
          </p>
        </div>

        {/* AI Auto-Remediation Runbook */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-3">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Autonomous SRE Mitigation Runbook
          </h3>
          <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-mono bg-slate-900 p-4 rounded-xl border border-slate-800">
            {incident.ai_remediation_plan}
          </div>
        </div>
      </div>
    </div>
  );
}
