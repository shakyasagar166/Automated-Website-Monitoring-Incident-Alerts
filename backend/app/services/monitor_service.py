from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.monitor import Monitor
from app.models.check_log import CheckLog
from app.schemas.monitor import MonitorCreate, MonitorUpdate

class MonitorService:
    def __init__(self, db: Session):
        self.db = db

    def create_monitor(self, monitor_data: MonitorCreate) -> Monitor:
        monitor = Monitor(
            name=monitor_data.name,
            url=monitor_data.url,
            monitor_type=monitor_data.monitor_type,
            interval_seconds=monitor_data.interval_seconds,
            timeout_seconds=monitor_data.timeout_seconds,
            status="UP",
            uptime_percentage=100.0,
            avg_response_time_ms=120.0,
            last_status_code=200,
            last_checked_at=datetime.utcnow(),
            ssl_valid=True,
            ssl_days_remaining=90,
            is_active=monitor_data.is_active
        )
        self.db.add(monitor)
        self.db.commit()
        self.db.refresh(monitor)
        return monitor

    def get_monitors(self, status: Optional[str] = None) -> List[Monitor]:
        query = self.db.query(Monitor)
        if status and status != "ALL":
            query = query.filter(Monitor.status == status)
        return query.order_by(Monitor.created_at.desc()).all()

    def get_monitor(self, monitor_id: int) -> Optional[Monitor]:
        return self.db.query(Monitor).filter(Monitor.id == monitor_id).first()

    def update_monitor(self, monitor_id: int, update_data: MonitorUpdate) -> Optional[Monitor]:
        monitor = self.get_monitor(monitor_id)
        if not monitor:
            return None
        data = update_data.model_dump(exclude_unset=True)
        for key, val in data.items():
            setattr(monitor, key, val)
        self.db.commit()
        self.db.refresh(monitor)
        return monitor

    def log_check(
        self,
        monitor_id: int,
        status: str,
        response_time_ms: float,
        status_code: int = 200,
        region: str = "us-east-1",
        error_message: Optional[str] = None
    ) -> CheckLog:
        check = CheckLog(
            monitor_id=monitor_id,
            status=status,
            response_time_ms=response_time_ms,
            status_code=status_code,
            region=region,
            error_message=error_message
        )
        self.db.add(check)

        # Update monitor rolling stats
        monitor = self.get_monitor(monitor_id)
        if monitor:
            monitor.status = status
            monitor.last_status_code = status_code
            monitor.last_checked_at = datetime.utcnow()
            monitor.avg_response_time_ms = round((monitor.avg_response_time_ms * 0.8) + (response_time_ms * 0.2), 1)
            if status == "DOWN":
                monitor.uptime_percentage = max(80.0, round(monitor.uptime_percentage - 0.2, 2))

        self.db.commit()
        self.db.refresh(check)
        return check
