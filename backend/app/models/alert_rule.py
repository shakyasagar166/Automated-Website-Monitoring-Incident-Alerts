from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from app.db.database import Base

class AlertRule(Base):
    __tablename__ = "alert_rules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    condition_type = Column(String(50), default="STATUS_DOWN") # STATUS_DOWN, HIGH_LATENCY, SSL_EXPIRY, 5XX_ERRORS
    threshold_value = Column(Float, default=1.0) # e.g. latency > 800ms or consecutive failures > 2
    severity = Column(String(20), default="P1")
    channel = Column(String(50), default="SLACK_AND_EMAIL") # EMAIL, SLACK, PAGERDUTY, WEBHOOK
    target_destination = Column(String(255), default="#production-alerts")
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
