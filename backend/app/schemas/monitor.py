from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CheckLogResponse(BaseModel):
    id: int
    monitor_id: int
    status: str
    response_time_ms: float
    status_code: int
    region: str
    error_message: Optional[str] = None
    checked_at: datetime

    class Config:
        from_attributes = True

class MonitorBase(BaseModel):
    name: str
    url: str
    monitor_type: str = "HTTPS"
    interval_seconds: int = 60
    timeout_seconds: float = 10.0
    is_active: bool = True

class MonitorCreate(MonitorBase):
    pass

class MonitorUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    monitor_type: Optional[str] = None
    interval_seconds: Optional[int] = None
    timeout_seconds: Optional[float] = None
    status: Optional[str] = None
    is_active: Optional[bool] = None

class MonitorResponse(MonitorBase):
    id: int
    status: str
    uptime_percentage: float
    avg_response_time_ms: float
    last_status_code: int
    last_checked_at: datetime
    ssl_valid: bool
    ssl_days_remaining: int
    ssl_issuer: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    checks: Optional[List[CheckLogResponse]] = []

    class Config:
        from_attributes = True
