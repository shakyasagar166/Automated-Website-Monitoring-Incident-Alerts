import React from 'react';
import IncidentTable from '../components/IncidentTable';
import IncidentDetails from '../components/IncidentDetails';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Incidents({ 
  incidents, 
  selectedIncident, 
  onSelectIncident, 
  onResolveIncident 
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-600/20 text-rose-400 rounded-2xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">SRE Incident War Room & Live Outages</h1>
            <p className="text-xs text-slate-400">
              AI-driven root cause analysis, automated triage, and mitigation runbooks
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 bg-rose-950 text-rose-300 border border-rose-800 rounded-full">
          {incidents.filter((i) => i.status === 'INVESTIGATING').length} Active Outages
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left List (6 cols on lg) */}
        <div className="lg:col-span-6 space-y-4">
          <IncidentTable
            incidents={incidents}
            onSelectIncident={onSelectIncident}
            onResolveIncident={onResolveIncident}
          />
        </div>

        {/* Right War Room Inspection (6 cols on lg) */}
        <div className="lg:col-span-6 h-[calc(100vh-210px)] min-h-[550px] sticky top-28">
          <IncidentDetails
            incident={selectedIncident}
            onResolve={onResolveIncident}
            onBack={() => onSelectIncident(null)}
          />
        </div>
      </div>
    </div>
  );
}
