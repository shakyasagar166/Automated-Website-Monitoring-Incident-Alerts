import React, { useState } from 'react';
import MonitorCard from '../components/MonitorCard';
import UptimeChart from '../components/UptimeChart';
import { Activity, PlusCircle, Search, Filter, X, Globe, Sparkles } from 'lucide-react';

export default function Monitors({ 
  monitors, 
  selectedMonitor, 
  onSelectMonitor, 
  onCheckNow, 
  onTriggerOutage, 
  onCreateMonitor,
  isModalOpen,
  setIsModalOpen,
  isChecking 
}) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [monitorType, setMonitorType] = useState('HTTPS');
  const [intervalSeconds, setIntervalSeconds] = useState(60);
  const [timeoutSeconds, setTimeoutSeconds] = useState(10);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = monitors.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    await onCreateMonitor({
      name,
      url,
      monitor_type: monitorType,
      interval_seconds: parseInt(intervalSeconds, 10),
      timeout_seconds: parseFloat(timeoutSeconds)
    });
    setName('');
    setUrl('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-2xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Synthetic Web & API Monitors</h1>
            <p className="text-xs text-slate-400">
              Multi-region uptime checks, latency telemetry, and SSL certificate expiration tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search monitors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Monitor</span>
          </button>
        </div>
      </div>

      {/* Latency History Chart for selected monitor */}
      {selectedMonitor && (
        <UptimeChart checks={selectedMonitor.checks || []} />
      )}

      {/* Monitors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((m) => (
          <MonitorCard
            key={m.id}
            monitor={m}
            onSelectMonitor={onSelectMonitor}
            onCheckNow={onCheckNow}
            onTriggerOutage={onTriggerOutage}
            isChecking={isChecking}
          />
        ))}
      </div>

      {/* Add Monitor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Add New Synthetic Monitor</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Friendly Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Core API Ingress Gateway"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Endpoint URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://api.example.com/health"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Type</label>
                  <select
                    value={monitorType}
                    onChange={(e) => setMonitorType(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="HTTPS">HTTPS</option>
                    <option value="HTTP">HTTP</option>
                    <option value="PING">ICMP Ping</option>
                    <option value="TCP_PORT">TCP Port</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Interval (s)</label>
                  <input
                    type="number"
                    min="15"
                    max="300"
                    value={intervalSeconds}
                    onChange={(e) => setIntervalSeconds(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Timeout (s)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={timeoutSeconds}
                    onChange={(e) => setTimeoutSeconds(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition"
                >
                  Start Monitoring
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
