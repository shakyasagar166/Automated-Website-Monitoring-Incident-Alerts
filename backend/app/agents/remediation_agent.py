from typing import Dict, Any, Optional
from app.integrations.llm_client import LLMClient
from app.core.logging_config import logger

class RemediationAgent:
    """Generates actionable runbook steps, rollback instructions, and health verification strategies."""

    def __init__(self, llm_client: Optional[LLMClient] = None):
        self.llm = llm_client or LLMClient()

    async def generate_remediation_plan(self, incident_title: str, root_cause: str) -> Dict[str, Any]:
        system_instruction = (
            "You are an SRE Auto-Remediation Specialist. Provide step-by-step mitigation actions, "
            "estimated time to recovery, and post-incident smoke test recommendations. Output JSON."
        )

        prompt = f"""
Incident: {incident_title}
Root Cause: {root_cause}

Provide JSON:
{{
  "action_steps": ["Step 1", "Step 2", "Step 3"],
  "estimated_recovery_time_minutes": integer,
  "rollback_procedure": "Specific rollback action"
}}
"""
        logger.info(f"[RemediationAgent] Planning runbook mitigation for '{incident_title}'")
        res = await self.llm.generate_json(prompt, system_instruction)
        return {
            "action_steps": res.get("action_steps", [
                "Restart affected backend pods",
                "Flush edge cache and re-validate SSL handshakes",
                "Execute automated test suites to verify stability"
            ]),
            "estimated_recovery_time_minutes": int(res.get("estimated_recovery_time_minutes", 10)),
            "rollback_procedure": res.get("rollback_procedure", "Revert to previous stable deployment release")
        }
