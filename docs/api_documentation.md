# API Documentation: Automated Website Monitoring & Incident Alerts

All REST API endpoints are hosted under `/api/v1` and authenticated using the `X-API-Key` header.

## 1. Authentication
```http
X-API-Key: monitoring-secret-key-2026
```

---

## 2. Monitor Endpoints

### List Monitors
`GET /api/v1/monitors?status=UP`

### Create Monitor
`POST /api/v1/monitors`
```json
{
  "name": "Production Auth API",
  "url": "https://auth.enterprise.io/health",
  "monitor_type": "HTTPS",
  "interval_seconds": 60,
  "timeout_seconds": 5.0
}
```

### Trigger Instant Synthetic Check
`POST /api/v1/checks/run-now/{monitor_id}`
Executes an immediate live probe and returns response latency and HTTP code.

---

## 3. Incident Endpoints

### List Incidents
`GET /api/v1/incidents?severity=P0&status=INVESTIGATING`

### Trigger Incident Diagnostic
`POST /api/v1/incidents/trigger`
```json
{
  "monitor_id": 4,
  "error_code": 502,
  "error_snippet": "502 Bad Gateway: Connection refused",
  "response_time_ms": 3450.0
}
```

### Update Incident Status
`PATCH /api/v1/incidents/{incident_id}`
```json
{
  "status": "RESOLVED"
}
```

---

## 4. Alert Rules

### List Rules
`GET /api/v1/alert-rules`

### Create Rule
`POST /api/v1/alert-rules`
```json
{
  "name": "Production Outage P0",
  "condition_type": "STATUS_DOWN",
  "threshold_value": 1.0,
  "severity": "P0",
  "channel": "SLACK_AND_EMAIL",
  "target_destination": "#production-alerts"
}
```

---

## 5. Professional Automation Testing References
- 📍 **[Uncodemy Automation Testing Course in Noida](https://uncodemy.com/course/automation-testing-course-in-noida)**
- 📍 **[Uncodemy Automation Testing Course in Delhi](https://uncodemy.com/course/automation-testing-course-in-Delhi)**
