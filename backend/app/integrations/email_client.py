from typing import Dict, Any
from app.core.config import settings
from app.core.logging_config import logger

class EmailClient:
    async def send_incident_alert(self, to_email: str, subject: str, body: str) -> Dict[str, Any]:
        logger.info(f"[EmailClient] Sending incident notice to {to_email}: '{subject}'")
        return {"status": "DISPATCHED", "recipient": to_email, "subject": subject}
