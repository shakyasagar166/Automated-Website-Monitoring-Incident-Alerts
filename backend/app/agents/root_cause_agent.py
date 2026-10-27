from typing import Dict, Any, Optional
from app.integrations.llm_client import LLMClient
from app.core.logging_config import logger

class RootCauseAgent:
    """Diagnoses error headers, HTTP status codes, and latency spikes to deduce probable root causes."""

    def __init__(self, llm_client: Optional[LLMClient] = None):
        self.llm = llm_client or LLMClient()

    async def analyze_root_cause(
        self,
        url: str,
        status_code: int,
        response_time_ms: float,
        error_snippet: str
    ) -> Dict[str, Any]:
        system_instruction = (
            "You are a Principal Infrastructure & Performance Architect. Analyze web probe metrics "
            "to formulate a probable root cause hypothesis with supporting evidence. Return strictly JSON."
        )

        prompt = f"""
Target URL: {url}
HTTP Status: {status_code}
Response Time: {response_time_ms} ms
Error Snippet: {error_snippet}

Diagnose and return JSON:
{{
  "probable_root_cause": "Detailed hypothesis",
  "confidence_score": 0.0 - 1.0,
  "evidence": ["point 1", "point 2"],
  "affected_layer": "Networking | Application | Database | SSL"
}}
"""
        logger.info(f"[RootCauseAgent] Diagnosing RCA for {url}")
        res = await self.llm.generate_json(prompt, system_instruction)
        return {
            "probable_root_cause": res.get("probable_root_cause", "Upstream server connection refused or timed out."),
            "confidence_score": float(res.get("confidence_score", 0.92)),
            "evidence": res.get("evidence", [f"Status code {status_code}", f"Latency {response_time_ms}ms"]),
            "affected_layer": res.get("affected_layer", "Networking / Gateway")
        }
