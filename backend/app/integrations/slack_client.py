from typing import Dict, Any
from app.core.logging_config import logger

class SlackClient:
    async def post_incident_notification(self, channel: str, message: str, severity: str = "P1") -> Dict[str, Any]:
        logger.info(f"[SlackClient] Posting {severity} alert to Slack channel {channel}: '{message[:60]}...'")
        return {"status": "POSTED", "channel": channel, "severity": severity}
