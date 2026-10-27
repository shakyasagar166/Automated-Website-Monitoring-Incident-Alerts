import asyncio
from app.agents.incident_triage_agent import IncidentTriageAgent
from app.agents.root_cause_agent import RootCauseAgent
from app.agents.remediation_agent import RemediationAgent

def test_incident_triage_agent():
    async def _test():
        agent = IncidentTriageAgent()
        res = await agent.triage_incident("API Ingress", "https://api.io/health", 502, "502 Bad Gateway")
        assert res["severity"] in ["P0", "P1"]
        assert "summary" in res
    asyncio.run(_test())

def test_root_cause_agent():
    async def _test():
        agent = RootCauseAgent()
        res = await agent.analyze_root_cause("https://api.io", 502, 3400.0, "Connection timeout")
        assert "probable_root_cause" in res
        assert res["confidence_score"] >= 0.8
    asyncio.run(_test())

def test_remediation_agent():
    async def _test():
        agent = RemediationAgent()
        res = await agent.generate_remediation_plan("P0 Gateway Outage", "Reverse proxy pool exhausted")
        assert "action_steps" in res
        assert len(res["action_steps"]) >= 2
    asyncio.run(_test())
