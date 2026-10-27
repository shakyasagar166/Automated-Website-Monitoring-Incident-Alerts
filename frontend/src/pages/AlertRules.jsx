import React from 'react';
import AlertRuleEditor from '../components/AlertRuleEditor';
import { Sliders } from 'lucide-react';

export default function AlertRules({ rules, onCreateRule, onDeleteRule }) {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex items-center gap-3">
        <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl">
          <Sliders className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Alert Trigger Policies & Escalation</h1>
          <p className="text-xs text-slate-400">
            Define SLA violation thresholds, Slack channels, and PagerDuty escalation targets
          </p>
        </div>
      </div>

      <AlertRuleEditor
        rules={rules}
        onCreateRule={onCreateRule}
        onDeleteRule={onDeleteRule}
      />
    </div>
  );
}
