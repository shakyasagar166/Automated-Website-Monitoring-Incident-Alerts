import json
import httpx
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.logging_config import logger

class LLMClient:
    """Multi-LLM client for Gemini, OpenAI, or simulated SRE/DevOps reasoning."""

    def __init__(self, provider: Optional[str] = None, model: Optional[str] = None):
        self.provider = provider or settings.DEFAULT_LLM_PROVIDER
        self.model = model or settings.DEFAULT_LLM_MODEL
        self.api_key = settings.GEMINI_API_KEY if self.provider == "gemini" else settings.OPENAI_API_KEY
        self.mock_mode = settings.MOCK_LLM_MODE or not self.api_key

    async def generate_json(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.2
    ) -> Dict[str, Any]:
        if not self.mock_mode and self.api_key:
            try:
                if self.provider == "gemini":
                    return await self._call_gemini(prompt, system_instruction, temperature)
                elif self.provider == "openai":
                    return await self._call_openai(prompt, system_instruction, temperature)
            except Exception as e:
                logger.warning(f"Live LLM call error ({str(e)}), defaulting to local SRE reasoning simulation.")

        return self._generate_simulated_json(prompt, system_instruction)

    async def _call_gemini(self, prompt: str, system_instruction: Optional[str], temperature: float) -> Dict[str, Any]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        contents = []
        if system_instruction:
            contents.append({"role": "user", "parts": [{"text": f"System:\n{system_instruction}"}]})
            contents.append({"role": "model", "parts": [{"text": "Understood. I will strictly output valid JSON."}]})
        contents.append({"role": "user", "parts": [{"text": prompt}]})

        payload = {
            "contents": contents,
            "generationConfig": {"temperature": temperature, "responseMimeType": "application/json"}
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.post(url, json=payload)
            res.raise_for_status()
            text = res.json()["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(text)

    async def _call_openai(self, prompt: str, system_instruction: Optional[str], temperature: float) -> Dict[str, Any]:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": self.model or "gpt-4o-mini",
            "messages": messages,
            "temperature": temperature,
            "response_format": {"type": "json_object"}
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.post(url, json=payload, headers=headers)
            res.raise_for_status()
            text = res.json()["choices"][0]["message"]["content"]
            return json.loads(text)

    def _generate_simulated_json(self, prompt: str, system_instruction: Optional[str]) -> Dict[str, Any]:
        text = f"{system_instruction or ''} {prompt}".lower()

        # 1. Incident Triage
        if "triage" in text or "severity" in text:
            severity = "P0" if any(w in text for w in ["502", "503", "down", "outage", "timeout"]) else "P2"
            return {
                "severity": severity,
                "urgency": "CRITICAL" if severity == "P0" else "HIGH",
                "summary": "Service degradation identified via synthetic multi-region ping failures.",
                "requires_oncall_page": severity == "P0",
                "recommended_channels": ["#incident-war-room", "pagerduty-p0-escalation"]
            }

        # 2. Root Cause Analysis
        if "root_cause" in text or "rca" in text or "diagnos" in text:
            return {
                "probable_root_cause": "Ingress reverse proxy connection pool exhaustion or TLS renegotiation bottleneck.",
                "confidence_score": 0.94,
                "evidence": [
                    "HTTP 502 Bad Gateway response received from origin cluster",
                    "Latency spiked from 140ms baseline to >3400ms threshold",
                    "Synthetic probing from multiple global regions confirmed packet drops"
                ],
                "affected_layer": "Networking / Load Balancer"
            }

        # 3. Remediation Planning
        if "remediat" in text or "fix" in text:
            return {
                "action_steps": [
                    "Scale upstream backend replica pods in Kubernetes cluster",
                    "Purge stale edge CDN cache entries for degraded endpoints",
                    "Verify SSL certificate validity and renew intermediate chain if necessary",
                    "Execute automated smoke and regression test suites to verify recovery"
                ],
                "estimated_recovery_time_minutes": 8,
                "rollback_procedure": "Revert to previous container deployment tag if error rate exceeds 5%"
            }

        return {
            "status": "COMPLETED",
            "message": "AI SRE reasoning completed successfully."
        }
