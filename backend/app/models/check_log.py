from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class CheckLog(Base):
    __tablename__ = "check_logs"

    id = Column(Integer, primary_key=True, index=True)
    monitor_id = Column(Integer, ForeignKey("monitors.id"), nullable=False)
    status = Column(String(50), default="UP") # UP, DOWN, DEGRADED
    response_time_ms = Column(Float, nullable=False)
    status_code = Column(Integer, default=200)
    region = Column(String(50), default="us-east-1") # us-east-1, eu-central-1, ap-south-1
    error_message = Column(Text, nullable=True)
    checked_at = Column(DateTime, default=datetime.utcnow)

    monitor = relationship("Monitor", back_populates="checks")
