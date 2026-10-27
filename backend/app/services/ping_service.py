import time
import httpx
from typing import Dict, Any
from app.core.config import settings
from app.core.logging_config import logger

class PingService:
    """Executes synthetic ping and HTTP response latency tests against target URLs."""

    async def probe_url(self, url: str, timeout_seconds: float = 10.0) -> Dict[str, Any]:
        if settings.MOCK_PROBE_MODE:
            # Deterministic fast probe simulation
            is_failing = "error" in url.lower() or "down" in url.lower()
            return {
                "status": "DOWN" if is_failing else "UP",
                "status_code": 502 if is_failing else 200,
                "response_time_ms": 3200.0 if is_failing else 135.0,
                "error_message": "502 Bad Gateway" if is_failing else None,
                "region": "us-east-1"
            }

        start_time = time.time()
        try:
            async with httpx.AsyncClient(timeout=timeout_seconds, follow_redirects=True) as client:
                res = await client.get(url)
                duration_ms = round((time.time() - start_time) * 1000, 1)
                is_up = res.status_code < 400
                return {
                    "status": "UP" if is_up else "DOWN",
                    "status_code": res.status_code,
                    "response_time_ms": duration_ms,
                    "error_message": None if is_up else f"HTTP Status {res.status_code}",
                    "region": "us-east-1"
                }
        except Exception as e:
            duration_ms = round((time.time() - start_time) * 1000, 1)
            return {
                "status": "DOWN",
                "status_code": 0,
                "response_time_ms": duration_ms,
                "error_message": str(e),
                "region": "us-east-1"
            }
