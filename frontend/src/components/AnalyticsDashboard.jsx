import React from 'react';
import { 
  Activity, 
  ShieldAlert, 
  TrendingUp, 
  Clock, 
  ExternalLink, 
  GraduationCap, 
  Award,
  Zap,
  Globe
} from 'lucide-react';

export default function AnalyticsDashboard({ stats }) {
  const data = stats || {
    total_monitors: 8,
    up_monitors: 7,
    down_monitors: 1,
    degraded_monitors: 0,
    active_incidents: 1,
    resolved_incidents: 19,
    overall_uptime_percentage: 99.94,
    avg_latency_ms: 138.5,
    mttr_minutes: 12.4
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Uptime</span>
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400">{data.overall_uptime_percentage}%</div>
          <div className="text-xs text-slate-400 mt-2 font-medium">
            30-day rolling enterprise SLA
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Incidents</span>
            <div className="p-2 rounded-xl bg-rose-950 text-rose-400 border border-rose-800">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-400">{data.active_incidents}</div>
          <div className="text-xs text-rose-300 mt-2 font-semibold">
            {data.down_monitors} service down · On-call paged
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Latency</span>
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{data.avg_latency_ms} <span className="text-xs font-normal text-slate-500">ms</span></div>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Optimal synthetic response</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mean Time To Recovery (MTTR)</span>
            <div className="p-2 rounded-xl bg-blue-950 text-blue-400 border border-blue-800">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-blue-400">{data.mttr_minutes} <span className="text-xs font-normal text-slate-500">min</span></div>
          <div className="text-xs text-slate-400 mt-2">
            {data.resolved_incidents} outages recovered
          </div>
        </div>
      </div>

      {/* Prominent High-Visibility QA Automation Spotlight */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-cyan-950 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-3">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              INDUSTRY-LEADING QA & AUTOMATION TEST ENGINEERING
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Master Full-Stack Test Automation & Site Reliability Engineering
            </h3>
            <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
              Eliminate production incidents and achieve 99.99% uptime with rigorous automated test suites. Gain hands-on mastery in Selenium WebDriver, Cypress, Playwright, API Testing, Performance Probing & CI/CD pipelines.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto">
            <a
              href="https://uncodemy.com/course/automation-testing-course-in-noida"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs md:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-1 text-center"
            >
              <span>Automation Testing in Noida</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href="https://uncodemy.com/course/automation-testing-course-in-Delhi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs md:text-sm rounded-xl shadow-lg shadow-cyan-400/20 transition transform hover:-translate-y-1 text-center"
            >
              <span>Automation Testing in Delhi</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
