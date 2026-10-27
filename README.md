# ⚡ Automated Website Monitoring & Incident Alerts System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)

---

## 🌟 FEATURED QA AUTOMATION TESTING PROGRAMS (NOIDA & DELHI)

> ### 🚀 Elevate Your Test Automation & Site Reliability Engineering Career:
>
> 📍 **[▶ ENROLL IN AUTOMATION TESTING COURSE IN NOIDA (UNCODEMY)](https://uncodemy.com/course/automation-testing-course-in-noida)**
> 
> 📍 **[▶ ENROLL IN AUTOMATION TESTING COURSE IN DELHI (UNCODEMY)](https://uncodemy.com/course/automation-testing-course-in-Delhi)**
>
> *Master Selenium, Cypress, Playwright, API Testing, Cucumber BDD & CI/CD with 100% placement support & live enterprise projects.*

---

## 📖 Overview

The **Automated Website Monitoring & Incident Alerts System** is a production-ready observability and automated reliability platform. It continuously executes multi-region synthetic uptime probes, monitors SSL certificate expiration windows, diagnoses HTTP 5xx errors via AI agents, and dispatches instant P0–P3 incident notifications across Slack, Email, and PagerDuty.

### Key Capabilities:
- **Synthetic Multi-Region Health Probing**: High-frequency HTTP, HTTPS, TCP, and ping probes tracking latency, status codes, and packet loss.
- **SSL / TLS Certificate Monitoring**: Real-time certificate expiration tracking, cipher inspection, and automatic warnings.
- **AI-Powered Root Cause Analysis (RCA)**: Multi-agent SRE intelligence diagnosing gateway exhaustion, database deadlocks, and container crash-loops.
- **Auto-Remediation Runbooks**: Automated mitigation plans and rollback instructions to minimize Mean Time to Recovery (MTTR).
- **Customizable Alert Rules**: Threshold-based triggers (`STATUS_DOWN`, `HIGH_LATENCY > 1500ms`, `5XX_ERRORS`, `SSL_EXPIRY < 30 days`).
- **Incident War Room Dashboard**: Live uptime percentages, interactive latency charts, and one-click synthetic check execution.

---

## 📂 Project Structure

```text
automated-website-monitoring-incident-alerts/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── MonitorCard.jsx             # Service status, uptime %, latency & SSL badge
│       │   ├── IncidentTable.jsx           # Active & resolved incidents directory
│       │   ├── UptimeChart.jsx             # Visual response latency & availability gauge
│       │   ├── AlertRuleEditor.jsx         # Custom trigger conditions & channel selector
│       │   ├── MetricGauge.jsx             # SLA & MTTR visual stats
│       │   ├── StatusBadge.jsx             # UP, DOWN, DEGRADED status badges
│       │   ├── IncidentDetails.jsx         # War room with AI root cause & runbooks
│       │   ├── AnalyticsDashboard.jsx      # Global uptime, MTTR & training spotlight
│       │   └── Navbar.jsx                  # Header with prominent Noida & Delhi links
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx               # Executive SRE overview & course cards
│       │   ├── Monitors.jsx                # Endpoint directory & instant probe runner
│       │   ├── Incidents.jsx               # Incident war room & triage console
│       │   ├── AlertRules.jsx              # Configurable alert policies
│       │   ├── StatusPages.jsx             # Public status page view
│       │   └── Settings.jsx                # Multi-LLM keys, SRE contacts & webhooks
│       │
│       ├── services/
│       │   └── api.js                      # Axios client with backend endpoints
│       ├── hooks/
│       │   └── useMonitors.js              # Custom monitor query hook
│       ├── utils/
│       │   └── formatters.js               # Latency & severity styling
│       ├── App.jsx                         # Main app routing & state
│       └── main.jsx                        # React root entrypoint
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── Dockerfile
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py                         # FastAPI setup & demo data seeder
│   │   ├── core/
│   │   │   ├── config.py                   # Pydantic Settings
│   │   │   ├── security.py                 # API Key authentication
│   │   │   └── logging_config.py           # Structured logger
│   │   ├── api/v1/
│   │   │   ├── monitors.py                 # Monitor CRUD & status updates
│   │   │   ├── incidents.py                # Incident triggering & diagnosis
│   │   │   ├── alert_rules.py              # Alert rules management
│   │   │   ├── checks.py                   # On-demand synthetic check triggers
│   │   │   └── analytics.py                # Uptime & SLA analytics
│   │   ├── agents/
│   │   │   ├── incident_triage_agent.py    # P0-P3 classification
│   │   │   ├── root_cause_agent.py         # AI Root Cause Analysis (RCA)
│   │   │   ├── remediation_agent.py        # Runbook & mitigation generator
│   │   │   └── notification_agent.py       # Alert formatting agent
│   │   ├── services/
│   │   │   ├── monitor_service.py
│   │   │   ├── ping_service.py
│   │   │   ├── incident_service.py
│   │   │   ├── alert_service.py
│   │   │   └── analytics_service.py
│   │   ├── integrations/
│   │   │   ├── webhook_client.py
│   │   │   ├── email_client.py
│   │   │   ├── slack_client.py
│   │   │   └── llm_client.py
│   │   ├── models/
│   │   │   ├── monitor.py
│   │   │   ├── check_log.py
│   │   │   ├── incident.py
│   │   │   ├── alert_rule.py
│   │   │   └── alert_channel.py
│   │   ├── schemas/
│   │   │   ├── monitor.py
│   │   │   ├── incident.py
│   │   │   └── alert_rule.py
│   │   ├── db/
│   │   │   ├── database.py
│   │   │   └── migrations/
│   │   ├── workers/
│   │   │   ├── monitor_worker.py
│   │   │   ├── alert_worker.py
│   │   │   └── escalation_worker.py
│   │   └── utils/
│   │       ├── ssl_checker.py
│   │       ├── http_prober.py
│   │       └── alert_templates.py
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_monitors.py
│   │   ├── test_incidents.py
│   │   ├── test_agents.py
│   │   └── test_api.py
│   ├── requirements.txt
│   ├── pytest.ini
│   └── Dockerfile
│
├── prompts/
│   ├── incident_triage.txt
│   ├── root_cause_analysis.txt
│   ├── auto_remediation.txt
│   └── oncall_summary.txt
│
├── workflows/
│   ├── p0_outage_workflow.json
│   ├── ssl_expiry_workflow.json
│   └── latency_degradation_workflow.json
│
├── docs/
│   ├── architecture.md
│   ├── api_documentation.md
│   └── setup_guide.md
│
├── infrastructure/
│   └── docker-compose.yml
│
├── .env.example
├── .gitignore
├── README.md
└── LICENSE
```

---

## ⚡ Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m pytest tests -v
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Swagger API docs available at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🎓 Recommended Industry Certification Programs
- 📌 **[Uncodemy Automation Testing Course in Noida](https://uncodemy.com/course/automation-testing-course-in-noida)**
- 📌 **[Uncodemy Automation Testing Course in Delhi](https://uncodemy.com/course/automation-testing-course-in-Delhi)**

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
