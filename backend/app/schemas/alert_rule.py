from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlertRuleBase(BaseModel):
    name: str
    condition_type: str = "STATUS_DOWN"
    threshold_value: float = 1.0
    severity: str = "P1"
    channel: str = "SLACK_AND_EMAIL"
    target_destination: str = "#production-alerts"
    is_active: bool = True

class AlertRuleCreate(AlertRuleBase):
    pass

class AlertRuleUpdate(BaseModel):
    name: Optional[str] = None
    condition_type: Optional[str] = None
    threshold_value: Optional[float] = None
    severity: Optional[str] = None
    channel: Optional[str] = None
    target_destination: Optional[str] = None
    is_active: Optional[bool] = None

class AlertRuleResponse(AlertRuleBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
