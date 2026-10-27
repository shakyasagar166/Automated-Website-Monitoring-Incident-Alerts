from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)
HEADERS = {settings.API_KEY_HEADER_NAME: settings.DEFAULT_API_KEY}

def test_list_incidents():
    res = client.get("/api/v1/incidents", headers=HEADERS)
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_trigger_incident():
    payload = {
        "monitor_id": 1,
        "error_code": 503,
        "error_snippet": "Service Unavailable upstream",
        "response_time_ms": 3800.0
    }
    res = client.post("/api/v1/incidents/trigger", json=payload, headers=HEADERS)
    assert res.status_code == 201
    data = res.json()
    assert "incident_number" in data
    assert data["severity"] in ["P0", "P1"]
    assert "root_cause_summary" in data
