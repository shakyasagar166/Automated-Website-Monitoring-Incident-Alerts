from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)
HEADERS = {settings.API_KEY_HEADER_NAME: settings.DEFAULT_API_KEY}

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_list_monitors():
    res = client.get("/api/v1/monitors", headers=HEADERS)
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 1

def test_create_monitor():
    payload = {
        "name": "Integration Test Service",
        "url": "https://test.enterprise-cloud.io/health",
        "monitor_type": "HTTPS",
        "interval_seconds": 60,
        "timeout_seconds": 5.0
    }
    res = client.post("/api/v1/monitors", json=payload, headers=HEADERS)
    assert res.status_code == 201
    created = res.json()
    assert created["name"] == payload["name"]
    assert created["status"] == "UP"
