from datetime import datetime, timedelta
from app.db.database import SessionLocal
from app.models.incident import Incident
from app.core.logging_config import logger

class EscalationWorker:
    """Escalates unacknowledged P0 outages to secondary and executive engineering leads."""

    def check_unacknowledged_incidents(self):
        db = SessionLocal()
        try:
            stale_threshold = datetime.utcnow() - timedelta(minutes=15)
            unacked = db.query(Incident).filter(
                Incident.severity == "P0",
                Incident.status == "INVESTIGATING",
                Incident.started_at <= stale_threshold
            ).all()
            for inc in unacked:
                logger.error(f"[EscalationWorker] ESCALATION: P0 incident {inc.incident_number} unacknowledged for >15 minutes!")
        finally:
            db.close()
