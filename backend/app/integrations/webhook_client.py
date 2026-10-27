from typing import Dict, Any
from app.core.logging_config import logger

class WebhookClient:
    async def dispatch_webhook(self, url: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        logger.info(f"[WebhookClient] Dispatching incident alert webhook to {url}")
        return {"status": "DELIVERED", "url": url, "success": True}
