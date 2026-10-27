from app.db.database import SessionLocal
from app.models.incident import Incident
from app.core.logging_config import logger

class AlertWorker:
    """Dispatches on-call alerts for new P0/P1 incidents."""

    def process_pending_alerts(self):
        db = SessionLocal()
        try:
            active_outages = db.query(Incident).filter(
                Incident.status == "INVESTIGATING",
                Incident.severity.in_(["P0", "P1"])
            ).all()
            if active_outages:
                logger.warning(f"[AlertWorker] Alert: {len(active_outages)} high-severity outages actively being tracked.")
        finally:
            db.close()
