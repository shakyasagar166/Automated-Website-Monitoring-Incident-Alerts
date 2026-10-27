from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    monitor_id = Column(Integer, ForeignKey("monitors.id"), nullable=False)
    incident_number = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    severity = Column(String(20), default="P1") # P0 (Critical Outage), P1 (High), P2 (Degraded), P3 (Minor)
    status = Column(String(50), default="INVESTIGATING") # INVESTIGATING, IDENTIFIED, MONITORING, RESOLVED
    
    # AI Diagnosis & Root Cause
    root_cause_summary = Column(Text, nullable=True)
    ai_remediation_plan = Column(Text, nullable=True)
    affected_components = Column(String(255), default="API Gateway & Ingress")
    
    started_at = Column(DateTime, default=datetime.utcnow)
    acknowledged_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    duration_minutes = Column(Float, default=0.0)

    monitor = relationship("Monitor", back_populates="incidents")
