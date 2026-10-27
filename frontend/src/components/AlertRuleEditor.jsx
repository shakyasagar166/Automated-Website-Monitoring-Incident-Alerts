import React, { useState } from 'react';
import { Sliders, PlusCircle, Trash2, Zap, X } from 'lucide-react';
import { getSeverityColor } from '../utils/formatters';

export default function AlertRuleEditor({ rules, onCreateRule, onDeleteRule }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [conditionType, setConditionType] = useState('STATUS_DOWN');
  const [thresholdValue, setThresholdValue] = useState('1');
  const [severity, setSeverity] = useState('P0');
  const [channel, setChannel] = useState('SLACK_AND_EMAIL');
  const [targetDestination, setTargetDestination] = useState('#production-alerts');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreateRule({
      name,
      condition_type: conditionType,
      threshold_value: parseFloat(thresholdValue),
      severity,
      channel,
      target_destination: targetDestination,
      is_active: true
    });
    setName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Active Alert Trigger Policies</h2>
          <p className="text-xs text-slate-400">Automated notification thresholds and on-call routing rules</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Alert Rule</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getSeverityColor(rule.severity)}`}>
                  {rule.severity}
                </span>
                <button
                  onClick={() => onDeleteRule(rule.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition"
                  title="Delete Rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-sm font-bold text-white mb-2">{rule.name}</h3>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs text-slate-300 mb-4">
                <div>
                  <span className="text-slate-500">Condition: </span>
                  <span className="font-semibold text-amber-400">{rule.condition_type}</span>
                  <span className="text-slate-400"> (Threshold: {rule.threshold_value})</span>
                </div>
                <div>
                  <span className="text-slate-500">Dispatch: </span>
                  <span className="font-semibold text-slate-200">{rule.channel}</span>
                  <span className="text-slate-400"> → {rule.target_destination}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Status: Active</span>
              <span className="text-emerald-400 font-semibold">Zero False-Positive Filter</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Create SRE Alert Rule</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Critical API Down Alert"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Trigger Condition</label>
                  <select
                    value={conditionType}
                    onChange={(e) => setConditionType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="STATUS_DOWN">STATUS_DOWN</option>
                    <option value="HIGH_LATENCY">HIGH_LATENCY (&gt; threshold ms)</option>
                    <option value="SSL_EXPIRY">SSL_EXPIRY (&lt; threshold days)</option>
                    <option value="5XX_ERRORS">5XX_ERRORS (Error spikes)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="P0">P0 - Critical Outage</option>
                    <option value="P1">P1 - High Degradation</option>
                    <option value="P2">P2 - Moderate Latency</option>
                    <option value="P3">P3 - Informational</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Threshold Value</label>
                  <input
                    type="number"
                    step="0.5"
                    value={thresholdValue}
                    onChange={(e) => setThresholdValue(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Notification Channel</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="SLACK_AND_EMAIL">Slack & Email</option>
                    <option value="SLACK">Slack Only</option>
                    <option value="EMAIL">Email Only</option>
                    <option value="PAGERDUTY">PagerDuty On-Call</option>
                    <option value="WEBHOOK">Custom Webhook</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Channel / Endpoint</label>
                <input
                  type="text"
                  required
                  value={targetDestination}
                  onChange={(e) => setTargetDestination(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
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
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
                >
                  Save Alert Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
