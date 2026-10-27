from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class Monitor(Base):
    __tablename__ = "monitors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    url = Column(String(500), nullable=False)
    monitor_type = Column(String(50), default="HTTP") # HTTP, HTTPS, TCP_PORT, PING, SSL_CERT
    interval_seconds = Column(Integer, default=60)
    timeout_seconds = Column(Float, default=10.0)
    
    # Live Health State
    status = Column(String(50), default="UP") # UP, DOWN, DEGRADED, PAUSED
    uptime_percentage = Column(Float, default=99.98)
    avg_response_time_ms = Column(Float, default=142.0)
    last_status_code = Column(Integer, default=200)
    last_checked_at = Column(DateTime, default=datetime.utcnow)
    
    # SSL Details
    ssl_valid = Column(Boolean, default=True)
    ssl_days_remaining = Column(Integer, default=85)
    ssl_issuer = Column(String(200), default="Let's Encrypt Authority X3")

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    checks = relationship("CheckLog", back_populates="monitor", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="monitor", cascade="all, delete-orphan")
