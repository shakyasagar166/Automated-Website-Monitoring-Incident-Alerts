from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.monitor import Monitor
from app.services.ping_service import PingService
from app.services.monitor_service import MonitorService
from app.core.logging_config import logger

class MonitorWorker:
    """Cyclic synthetic prober running health checks across all active endpoints."""

    async def execute_probe_cycle(self):
        db: Session = SessionLocal()
        try:
            active_monitors = db.query(Monitor).filter(Monitor.is_active.is_(True)).all()
            logger.info(f"[MonitorWorker] Starting synthetic check sweep on {len(active_monitors)} targets...")
            ping_svc = PingService()
            monitor_svc = MonitorService(db)

            for m in active_monitors:
                res = await ping_svc.probe_url(m.url, m.timeout_seconds)
                monitor_svc.log_check(
                    monitor_id=m.id,
                    status=res["status"],
                    response_time_ms=res["response_time_ms"],
                    status_code=res["status_code"],
                    error_message=res.get("error_message")
                )
        finally:
            db.close()
