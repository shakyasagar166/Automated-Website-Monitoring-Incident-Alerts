from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class IncidentBase(BaseModel):
    monitor_id: int
    title: str
    severity: str = "P1"
    status: str = "INVESTIGATING"
    root_cause_summary: Optional[str] = None
    ai_remediation_plan: Optional[str] = None
    affected_components: Optional[str] = "API Gateway & Ingress"

class IncidentCreate(IncidentBase):
    pass

class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    root_cause_summary: Optional[str] = None
    ai_remediation_plan: Optional[str] = None

class IncidentResponse(IncidentBase):
    id: int
    incident_number: str
    started_at: datetime
    acknowledged_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    duration_minutes: float

    class Config:
        from_attributes = True

class DiagnoseRequest(BaseModel):
    monitor_id: int
    error_code: int = 502
    error_snippet: Optional[str] = "Bad Gateway: Connection refused upstream"
    response_time_ms: float = 3450.0
