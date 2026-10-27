import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Cpu, 
  Bell, 
  Save, 
  CheckCircle2, 
  GraduationCap, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export default function Settings() {
  const [provider, setProvider] = useState('gemini');
  const [mockLlm, setMockLlm] = useState(true);
  const [probeInterval, setProbeInterval] = useState('60');
  const [slackChannel, setSlackChannel] = useState('#production-p0-alerts');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Monitoring & Alert Settings</h1>
            <p className="text-xs text-slate-400">
              Configure AI diagnostic reasoning, on-call alert delivery, and synthetic probing thresholds
            </p>
          </div>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SRE AI Engine */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            AI Root Cause & Incident Diagnostics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary LLM Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="gemini">Google Gemini 2.5 Flash (Recommended)</option>
                <option value="openai">OpenAI GPT-4o-mini</option>
                <option value="offline">Offline SRE Reasoning Simulator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Execution Mode</label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="mockLlm"
                  checked={mockLlm}
                  onChange={(e) => setMockLlm(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="mockLlm" className="text-xs text-slate-300">
                  Enable zero-latency offline diagnostic mode
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Probing Defaults */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            Synthetic Probe Cadence & On-Call Targets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Default Probe Interval (Seconds)</label>
              <input
                type="number"
                value={probeInterval}
                onChange={(e) => setProbeInterval(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Default Incident Slack Channel</label>
              <input
                type="text"
                value={slackChannel}
                onChange={(e) => setSlackChannel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Recommended QA Certifications Section */}
      <div className="p-8 rounded-3xl bg-slate-900 border-2 border-amber-500/40 shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white">Recommended QA Automation Testing Programs</h2>
        </div>
        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
          Prevent outages before deployment through rigorous automated test pipelines. Explore these top-tier hands-on programs to master enterprise QA test automation:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://uncodemy.com/course/automation-testing-course-in-noida"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 hover:border-amber-400 transition block group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Uncodemy Noida</span>
              <ExternalLink className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-amber-300">
              Automation Testing Course in Noida
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Master Selenium WebDriver, TestNG, Jenkins, Git, and Cucumber BDD with 100% placement assurance in Noida.
            </p>
          </a>

          <a
            href="https://uncodemy.com/course/automation-testing-course-in-Delhi"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 hover:border-cyan-400 transition block group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider">Uncodemy Delhi</span>
              <ExternalLink className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-300">
              Automation Testing Course in Delhi
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Advanced curriculum covering Cypress, Playwright, API test automation, and enterprise CI/CD integration in Delhi.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
