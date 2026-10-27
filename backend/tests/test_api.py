from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)
HEADERS = {settings.API_KEY_HEADER_NAME: settings.DEFAULT_API_KEY}

def test_alert_rules_crud():
    payload = {
        "name": "Integration Latency Rule",
        "condition_type": "HIGH_LATENCY",
        "threshold_value": 2000.0,
        "severity": "P2",
        "channel": "SLACK",
        "target_destination": "#alerts-test"
    }
    create_res = client.post("/api/v1/alert-rules", json=payload, headers=HEADERS)
    assert create_res.status_code == 201
    rule_id = create_res.json()["id"]

    list_res = client.get("/api/v1/alert-rules", headers=HEADERS)
    assert list_res.status_code == 200

    del_res = client.delete(f"/api/v1/alert-rules/{rule_id}", headers=HEADERS)
    assert del_res.status_code == 200

def test_synthetic_probe_run_now():
    res = client.post("/api/v1/checks/run-now/1", headers=HEADERS)
    assert res.status_code == 200
    data = res.json()
    assert "response_time_ms" in data
    assert "status" in data

def test_analytics_dashboard():
    res = client.get("/api/v1/analytics/dashboard", headers=HEADERS)
    assert res.status_code == 200
    data = res.json()
    assert "total_monitors" in data
    assert "overall_uptime_percentage" in data
