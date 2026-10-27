from typing import Dict, Any, Optional
from app.integrations.llm_client import LLMClient
from app.core.logging_config import logger

class IncidentTriageAgent:
    """Classifies synthetic failure telemetry into P0-P3 incident severities."""

    def __init__(self, llm_client: Optional[LLMClient] = None):
        self.llm = llm_client or LLMClient()

    async def triage_incident(self, monitor_name: str, url: str, status_code: int, error_text: str) -> Dict[str, Any]:
        system_instruction = (
            "You are an expert Site Reliability Engineer (SRE) Incident Commander. Classify incident severity "
            "(P0 Critical Outage, P1 Major Degradation, P2 Minor Latency, P3 Informational) and output JSON."
        )

        prompt = f"""
Monitor Name: {monitor_name}
Target URL: {url}
Reported Status Code: {status_code}
Error Message: {error_text}

Analyze and return JSON:
{{
  "severity": "P0 | P1 | P2 | P3",
  "urgency": "CRITICAL | HIGH | MEDIUM | LOW",
  "summary": "Brief incident summary",
  "requires_oncall_page": boolean,
  "recommended_channels": ["string"]
}}
"""
        logger.info(f"[IncidentTriageAgent] Triaging failure for {monitor_name} ({status_code})")
        res = await self.llm.generate_json(prompt, system_instruction)
        return {
            "severity": res.get("severity", "P1"),
            "urgency": res.get("urgency", "HIGH"),
            "summary": res.get("summary", f"Failure detected on {monitor_name} ({status_code})"),
            "requires_oncall_page": res.get("requires_oncall_page", True),
            "recommended_channels": res.get("recommended_channels", ["#production-alerts"])
        }
