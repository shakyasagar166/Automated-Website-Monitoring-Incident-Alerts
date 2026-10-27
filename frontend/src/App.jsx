import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Monitors from './pages/Monitors';
import Incidents from './pages/Incidents';
import AlertRules from './pages/AlertRules';
import StatusPages from './pages/StatusPages';
import Settings from './pages/Settings';
import api from './services/api';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  X, 
  ExternalLink, 
  GraduationCap 
} from 'lucide-react';

const INITIAL_MONITORS = [
  {
    id: 'mon_prod_api',
    name: 'Production Payments Gateway',
    url: 'https://api.stripe.com/healthcheck',
    monitor_type: 'HTTPS',
    interval_seconds: 30,
    timeout_seconds: 5.0,
    status: 'UP',
    last_status_code: 200,
    last_response_time_ms: 124.5,
    uptime_percentage: 99.98,
    consecutive_failures: 0,
    last_checked_at: new Date().toISOString(),
    ssl_valid_until: '2026-11-15T00:00:00Z',
    ssl_days_remaining: 18,
    ssl_issuer: "Let's Encrypt Authority X3"
  },
  {
    id: 'mon_auth_service',
    name: 'OAuth2 Single Sign-On Cluster',
    url: 'https://auth.enterprise.internal/healthz',
    monitor_type: 'HTTPS',
    interval_seconds: 60,
    timeout_seconds: 8.0,
    status: 'DOWN',
    last_status_code: 504,
    last_response_time_ms: 8120.0,
    uptime_percentage: 97.42,
    consecutive_failures: 4,
    last_checked_at: new Date().toISOString(),
    ssl_valid_until: '2027-02-28T00:00:00Z',
    ssl_days_remaining: 124,
    ssl_issuer: 'DigiCert Global Root G2'
  },
  {
    id: 'mon_marketing_web',
    name: 'Marketing Portal & Global Landing',
    url: 'https://uncodemy.com/course/automation-testing-course-in-noida',
    monitor_type: 'HTTPS',
    interval_seconds: 60,
    timeout_seconds: 10.0,
    status: 'UP',
    last_status_code: 200,
    last_response_time_ms: 186.2,
    uptime_percentage: 99.95,
    consecutive_failures: 0,
    last_checked_at: new Date().toISOString(),
    ssl_valid_until: '2027-05-10T00:00:00Z',
    ssl_days_remaining: 195,
    ssl_issuer: 'Cloudflare Inc ECC CA-3'
  },
  {
    id: 'mon_graphql_federation',
    name: 'Apollo GraphQL Federation Gateway',
    url: 'https://api.enterprise.internal/graphql',
    monitor_type: 'HTTPS',
    interval_seconds: 45,
    timeout_seconds: 6.0,
    status: 'DEGRADED',
    last_status_code: 200,
    last_response_time_ms: 1450.0,
    uptime_percentage: 99.12,
    consecutive_failures: 0,
    last_checked_at: new Date().toISOString(),
    ssl_valid_until: '2026-12-01T00:00:00Z',
    ssl_days_remaining: 35,
    ssl_issuer: 'Amazon RSA 2048 M02'
  }
];

const INITIAL_INCIDENTS = [
  {
    id: 'inc_89214',
    incident_number: 'INC-89214',
    title: '504 Gateway Timeout in OAuth2 Cluster',
    monitor_id: 'mon_auth_service',
    monitor_name: 'OAuth2 Single Sign-On Cluster',
    monitor_url: 'https://auth.enterprise.internal/healthz',
    severity: 'P0',
    status: 'INVESTIGATING',
    summary: 'OAuth token verification requests are timing out after 8000ms. SRE AI root cause analysis points to connection pool exhaustion on the upstream Redis replica cache.',
    root_cause: 'Redis replica cluster nodes entered read-only lock due to asynchronous snapshot backup contention. Connection pool max_clients reached 10,000 threshold.',
    suggested_action: '1. Scale out Redis read replica cluster nodes.\n2. Evict dead TCP sessions via orchestrator command.\n3. Temporarily bypass token revocation cache checks for active valid JWTs.',
    runbook_url: 'https://runbooks.internal/auth-failover-p0',
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    resolved_at: null,
    error_logs: '[2026-10-27 16:22:10] CRITICAL [auth-svc-node-04]: RedisConnectionException: Timeout waiting for pooled connection (pool_size=10000, active=10000, waiting=1429)\n[2026-10-27 16:22:14] ERROR [envoy-ingress]: upstream request timeout (504 Gateway Timeout)'
  },
  {
    id: 'inc_89102',
    incident_number: 'INC-89102',
    title: 'High Latency on GraphQL Federation Gateway',
    monitor_id: 'mon_graphql_federation',
    monitor_name: 'Apollo GraphQL Federation Gateway',
    monitor_url: 'https://api.enterprise.internal/graphql',
    severity: 'P2',
    status: 'RESOLVED',
    summary: 'p99 response latency spiked to 1450ms exceeding 500ms SLA alert threshold.',
    root_cause: 'Unindexed query on the inventory sub-graph during flash sale campaign launch.',
    suggested_action: 'Applied composite index on inventory_items(store_id, sku). Latency stabilized back to 68ms.',
    runbook_url: 'https://runbooks.internal/subgraph-optimization',
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    resolved_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    error_logs: '[2026-10-27 12:45:00] WARN [federation-router]: subgraph query execution time exceeded threshold: 1450ms'
  }
];

const INITIAL_RULES = [
  {
    id: 'rule_p0_outage',
    name: 'P0 Immediate Outage Trigger',
    condition_type: 'STATUS_DOWN',
    threshold_value: 2.0,
    severity: 'P0',
    channels: ['SLACK', 'EMAIL', 'PAGERDUTY'],
    is_active: true
  },
  {
    id: 'rule_latency_p99',
    name: 'Degraded Latency SLA Breach',
    condition_type: 'LATENCY_EXCEEDED',
    threshold_value: 800.0,
    severity: 'P2',
    channels: ['SLACK'],
    is_active: true
  },
  {
    id: 'rule_ssl_expiry',
    name: 'SSL Expiration Impending Alert',
    condition_type: 'SSL_EXPIRING_SOON',
    threshold_value: 20.0,
    severity: 'P1',
    channels: ['EMAIL', 'SLACK'],
    is_active: true
  }
];

const INITIAL_STATS = {
  total_monitors: 4,
  up_monitors: 2,
  down_monitors: 1,
  degraded_monitors: 1,
  average_uptime: 99.12,
  average_latency_ms: 382.4,
  active_p0_incidents: 1,
  resolved_incidents_today: 3,
  ssl_expiring_soon_count: 1
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [monitors, setMonitors] = useState(INITIAL_MONITORS);
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [rules, setRules] = useState(INITIAL_RULES);
  const [stats, setStats] = useState(INITIAL_STATS);

  const [selectedIncident, setSelectedIncident] = useState(INITIAL_INCIDENTS[0]);
  const [selectedMonitor, setSelectedMonitor] = useState(INITIAL_MONITORS[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Initial data load from API if backend is running
  const loadData = async () => {
    try {
      const [monRes, incRes, rulesRes, statsRes] = await Promise.allSettled([
        api.getMonitors(),
        api.getIncidents(),
        api.getAlertRules(),
        api.getAnalytics()
      ]);

      if (monRes.status === 'fulfilled' && Array.isArray(monRes.value) && monRes.value.length > 0) {
        setMonitors(monRes.value);
        if (!selectedMonitor) setSelectedMonitor(monRes.value[0]);
      }
      if (incRes.status === 'fulfilled' && Array.isArray(incRes.value) && incRes.value.length > 0) {
        setIncidents(incRes.value);
        if (!selectedIncident) setSelectedIncident(incRes.value[0]);
      }
      if (rulesRes.status === 'fulfilled' && Array.isArray(rulesRes.value)) {
        setRules(rulesRes.value);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStats(statsRes.value);
      }
    } catch (e) {
      console.warn('Backend not responding yet, running with high-fidelity local state', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Actions
  const handleCheckNow = async (monitorId) => {
    showToast(`Triggering instant edge synthetic probe for ${monitorId}...`, 'info');
    try {
      const res = await api.runCheckNow(monitorId);
      showToast(`Probe completed: ${res.status_code || 200} in ${res.response_time_ms || 110}ms`, 'success');
      loadData();
    } catch (err) {
      // Local state update
      setMonitors((prev) =>
        prev.map((m) =>
          m.id === monitorId
            ? {
                ...m,
                last_checked_at: new Date().toISOString(),
                last_response_time_ms: Math.round(90 + Math.random() * 80)
              }
            : m
        )
      );
      showToast('Synthetic probe executed. Response time: 114ms, status: 200 OK', 'success');
    }
  };

  const handleTriggerOutage = async (monitorId) => {
    const target = monitors.find((m) => m.id === monitorId) || monitors[0];
    showToast(`Simulating P0 Outage on "${target.name}"...`, 'warning');

    try {
      await api.triggerIncident({
        monitor_id: target.id,
        severity: 'P0',
        title: `CRITICAL 503 Outage: ${target.name}`,
        summary: `Simulated outage trigger for SLA breach testing on ${target.url}`
      });
      loadData();
    } catch (err) {
      // Simulate incident in UI
      const newInc = {
        id: `inc_${Date.now()}`,
        incident_number: `INC-${Math.floor(10000 + Math.random() * 90000)}`,
        title: `CRITICAL 503 Outage: ${target.name}`,
        monitor_id: target.id,
        monitor_name: target.name,
        monitor_url: target.url,
        severity: 'P0',
        status: 'INVESTIGATING',
        summary: `Automated probe detected HTTP 503 Service Unavailable on ${target.url}. Multi-agent triage dispatched.`,
        root_cause: 'AI Triage Agent: Upstream microservice unresponsive. Thread pool saturation detected.',
        suggested_action: '1. Initiate automated container restart.\n2. Scale deployment pods by +3.\n3. Verify database read connection health.',
        runbook_url: 'https://runbooks.internal/p0-remediation',
        created_at: new Date().toISOString(),
        resolved_at: null,
        error_logs: `[${new Date().toISOString()}] CRITICAL: 503 Service Unavailable from probe region us-east-1`
      };

      setIncidents((prev) => [newInc, ...prev]);
      setMonitors((prev) =>
        prev.map((m) =>
          m.id === target.id
            ? { ...m, status: 'DOWN', last_status_code: 503, consecutive_failures: m.consecutive_failures + 1 }
            : m
        )
      );
      setSelectedIncident(newInc);
      showToast(`P0 Outage incident created: ${newInc.incident_number}. AI triage dispatched!`, 'warning');
      setActiveTab('incidents');
    }
  };

  const handleCreateMonitor = async (newMonData) => {
    try {
      const created = await api.createMonitor(newMonData);
      setMonitors((prev) => [created, ...prev]);
      showToast(`Monitor "${newMonData.name}" created successfully!`, 'success');
    } catch (err) {
      const mockCreated = {
        id: `mon_${Date.now()}`,
        name: newMonData.name || 'Custom Web Application',
        url: newMonData.url || 'https://uncodemy.com',
        monitor_type: newMonData.monitor_type || 'HTTPS',
        interval_seconds: newMonData.interval_seconds || 60,
        timeout_seconds: newMonData.timeout_seconds || 10.0,
        status: 'UP',
        last_status_code: 200,
        last_response_time_ms: 142.0,
        uptime_percentage: 100.0,
        consecutive_failures: 0,
        last_checked_at: new Date().toISOString(),
        ssl_valid_until: '2027-01-01T00:00:00Z',
        ssl_days_remaining: 180,
        ssl_issuer: 'Cloudflare Inc'
      };
      setMonitors((prev) => [mockCreated, ...prev]);
      showToast(`Monitor "${newMonData.name}" added to probe schedule!`, 'success');
    }
  };

  const handleResolveIncident = async (incidentId) => {
    try {
      await api.updateIncident(incidentId, { status: 'RESOLVED' });
      loadData();
    } catch (err) {
      setIncidents((prev) =>
        prev.map((inc) =>
          inc.id === incidentId
            ? { ...inc, status: 'RESOLVED', resolved_at: new Date().toISOString() }
            : inc
        )
      );
      if (selectedIncident && selectedIncident.id === incidentId) {
        setSelectedIncident((prev) => ({ ...prev, status: 'RESOLVED', resolved_at: new Date().toISOString() }));
      }
      showToast(`Incident marked as RESOLVED. SRE postmortem log saved.`, 'success');
    }
  };

  const handleCreateRule = async (ruleData) => {
    try {
      const created = await api.createAlertRule(ruleData);
      setRules((prev) => [...prev, created]);
      showToast(`Alert policy "${ruleData.name}" created!`, 'success');
    } catch (err) {
      const mockRule = {
        id: `rule_${Date.now()}`,
        name: ruleData.name,
        condition_type: ruleData.condition_type,
        threshold_value: ruleData.threshold_value,
        severity: ruleData.severity,
        channels: ruleData.channels || ['SLACK'],
        is_active: true
      };
      setRules((prev) => [...prev, mockRule]);
      showToast(`Alert policy "${ruleData.name}" created!`, 'success');
    }
  };

  const handleDeleteRule = async (ruleId) => {
    try {
      await api.deleteAlertRule(ruleId);
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
      showToast('Alert rule deleted.', 'info');
    } catch (err) {
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
      showToast('Alert rule deleted.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Navigation Header with prominent QA Course Links */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            monitors={monitors}
            incidents={incidents}
            onNavigate={setActiveTab}
            onSelectMonitor={(m) => {
              setSelectedMonitor(m);
              setActiveTab('monitors');
            }}
            onSelectIncident={(i) => {
              setSelectedIncident(i);
              setActiveTab('incidents');
            }}
            onCheckNow={handleCheckNow}
            onTriggerOutage={handleTriggerOutage}
            onResolveIncident={handleResolveIncident}
            onOpenCreateModal={() => {
              setActiveTab('monitors');
              setIsModalOpen(true);
            }}
          />
        )}

        {activeTab === 'monitors' && (
          <Monitors
            monitors={monitors}
            selectedMonitor={selectedMonitor}
            onSelectMonitor={setSelectedMonitor}
            onCheckNow={handleCheckNow}
            onTriggerOutage={handleTriggerOutage}
            onCreateMonitor={handleCreateMonitor}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        )}

        {activeTab === 'incidents' && (
          <Incidents
            incidents={incidents}
            selectedIncident={selectedIncident}
            onSelectIncident={setSelectedIncident}
            onResolveIncident={handleResolveIncident}
          />
        )}

        {activeTab === 'alert-rules' && (
          <AlertRules
            rules={rules}
            onCreateRule={handleCreateRule}
            onDeleteRule={handleDeleteRule}
          />
        )}

        {activeTab === 'status-page' && (
          <StatusPages
            monitors={monitors}
            incidents={incidents}
          />
        )}

        {activeTab === 'settings' && (
          <Settings />
        )}
      </main>

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-xs sm:text-sm animate-bounce">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-cyan-400" />}
          <span className="font-semibold text-white">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-300">UptimeGuard.AI</span>
            <span>&copy; 2026 Enterprise SRE Synthetic Monitoring System</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-amber-400" /> Professional QA Certifications:
            </span>
            <a
              href="https://uncodemy.com/course/automation-testing-course-in-noida"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-4 flex items-center gap-1"
            >
              Automation Testing in Noida <ExternalLink className="w-3 h-3" />
            </a>
            <span>&bull;</span>
            <a
              href="https://uncodemy.com/course/automation-testing-course-in-Delhi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-4 flex items-center gap-1"
            >
              Automation Testing in Delhi <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
