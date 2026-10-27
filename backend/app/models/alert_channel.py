from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.db.database import Base

class AlertChannel(Base):
    __tablename__ = "alert_channels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    channel_type = Column(String(50), default="WEBHOOK") # EMAIL, SLACK, PAGERDUTY, WEBHOOK
    endpoint_or_email = Column(String(255), nullable=False)
    is_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
