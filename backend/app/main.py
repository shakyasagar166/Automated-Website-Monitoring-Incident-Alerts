from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.logging_config import logger
from app.db.database import init_db, SessionLocal
from app.api.v1 import api_v1_router
from app.models.monitor import Monitor
from app.models.check_log import CheckLog
from app.models.incident import Incident
from app.models.alert_rule import AlertRule
from app.models.alert_channel import AlertChannel

def seed_monitoring_demo_data():
    db: Session = SessionLocal()
    try:
        if db.query(Monitor).count() == 0:
            logger.info("Seeding initial monitors, synthetic check logs, incidents, and alert rules...")

            # 1. Monitors
            m1 = Monitor(
                name="Primary API Gateway (Production)",
                url="https://api.enterprise-cloud.io/v1/health",
                monitor_type="HTTPS",
                interval_seconds=60,
                timeout_seconds=10.0,
                status="UP",
                uptime_percentage=99.99,
                avg_response_time_ms=118.0,
                last_status_code=200,
                ssl_valid=True,
                ssl_days_remaining=82,
                ssl_issuer="DigiCert Global Root CA"
            )

            m2 = Monitor(
                name="Payment & Checkout Service",
                url="https://checkout.enterprise-cloud.io/status",
                monitor_type="HTTPS",
                interval_seconds=30,
                timeout_seconds=5.0,
                status="DEGRADED",
                uptime_percentage=99.82,
                avg_response_time_ms=640.0,
                last_status_code=200,
                ssl_valid=True,
                ssl_days_remaining=45,
                ssl_issuer="Let's Encrypt Authority X3"
            )

            m3 = Monitor(
                name="Customer Identity & SSO Auth",
                url="https://auth.enterprise-cloud.io/oauth2/status",
                monitor_type="HTTPS",
                interval_seconds=60,
                timeout_seconds=8.0,
                status="UP",
                uptime_percentage=100.0,
                avg_response_time_ms=92.0,
                last_status_code=200,
                ssl_valid=True,
                ssl_days_remaining=114,
                ssl_issuer="Amazon RSA 2048 M02"
            )

            m4 = Monitor(
                name="Analytics & Telemetry Ingestion Cluster",
                url="https://telemetry.enterprise-cloud.io/ping",
                monitor_type="HTTPS",
                interval_seconds=60,
                timeout_seconds=10.0,
                status="DOWN",
                uptime_percentage=98.45,
                avg_response_time_ms=3150.0,
                last_status_code=502,
                ssl_valid=True,
                ssl_days_remaining=19,
                ssl_issuer="Let's Encrypt Authority X3"
            )

            db.add_all([m1, m2, m3, m4])
            db.commit()
            db.refresh(m1)
            db.refresh(m2)
            db.refresh(m3)
            db.refresh(m4)

            # 2. Check logs for Monitor 4
            now = datetime.utcnow()
            c1 = CheckLog(
                monitor_id=m4.id,
                status="DOWN",
                response_time_ms=3450.0,
                status_code=502,
                region="us-east-1",
                error_message="502 Bad Gateway: Upstream connection refused",
                checked_at=now - timedelta(minutes=4)
            )
            c2 = CheckLog(
                monitor_id=m4.id,
                status="DOWN",
                response_time_ms=3120.0,
                status_code=502,
                region="eu-central-1",
                error_message="502 Bad Gateway: Upstream connection refused",
                checked_at=now - timedelta(minutes=2)
            )
            db.add_all([c1, c2])

            # 3. Active Incident for Monitor 4
            inc = Incident(
                monitor_id=m4.id,
                incident_number="INC-89214",
                title="Telemetry Cluster Ingestion 502 Bad Gateway Outage",
                severity="P0",
                status="INVESTIGATING",
                root_cause_summary="Reverse proxy worker pool connection exhaustion following memory pressure on upstream telemetry ingestion pods.",
                ai_remediation_plan="• Horizontally auto-scale telemetry-worker deployments in us-east-1\n• Purge dead TCP sockets on Envoy Ingress proxy\n• Run regression load tests to verify message throughput",
                affected_components="Telemetry Pods / Envoy Ingress Gateway",
                started_at=now - timedelta(minutes=14)
            )
            db.add(inc)

            # 4. Alert Rules
            r1 = AlertRule(
                name="Critical Service Down Alert (P0)",
                condition_type="STATUS_DOWN",
                threshold_value=1.0,
                severity="P0",
                channel="SLACK_AND_EMAIL",
                target_destination="#production-p0-war-room",
                is_active=True
            )
            r2 = AlertRule(
                name="High Latency Warning Alert (P2)",
                condition_type="HIGH_LATENCY",
                threshold_value=1500.0,
                severity="P2",
                channel="SLACK",
                target_destination="#latency-alerts",
                is_active=True
            )
            r3 = AlertRule(
                name="SSL Certificate Expiry (< 30 days)",
                condition_type="SSL_EXPIRY",
                threshold_value=30.0,
                severity="P3",
                channel="EMAIL",
                target_destination="security-ops@enterprise-cloud.io",
                is_active=True
            )
            db.add_all([r1, r2, r3])
            db.commit()
            logger.info("Demo website monitoring and incident data populated.")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed_monitoring_demo_data()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise Automated Website Uptime Monitoring, Multi-Region Synthetic Probing, and AI Incident Alerts",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "timestamp": datetime.utcnow().isoformat(),
        "uncodemy_courses": {
            "noida": settings.UNCODEMY_NOIDA_COURSE,
            "delhi": settings.UNCODEMY_DELHI_COURSE
        }
    }
