from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.incident import Incident
from app.models.monitor import Monitor
from app.agents.incident_triage_agent import IncidentTriageAgent
from app.agents.root_cause_agent import RootCauseAgent
from app.agents.remediation_agent import RemediationAgent
from app.agents.notification_agent import NotificationAgent
from app.integrations.slack_client import SlackClient
from app.integrations.email_client import EmailClient
from app.schemas.incident import IncidentCreate, IncidentUpdate

class IncidentService:
    def __init__(self, db: Session):
        self.db = db
        self.triage_agent = IncidentTriageAgent()
        self.rca_agent = RootCauseAgent()
        self.remediation_agent = RemediationAgent()
        self.notification_agent = NotificationAgent()
        self.slack_client = SlackClient()
        self.email_client = EmailClient()

    async def trigger_incident(
        self,
        monitor_id: int,
        status_code: int = 502,
        error_snippet: str = "Connection refused",
        response_time_ms: float = 3000.0
    ) -> Incident:
        monitor = self.db.query(Monitor).filter(Monitor.id == monitor_id).first()
        monitor_name = monitor.name if monitor else f"Monitor #{monitor_id}"
        monitor_url = monitor.url if monitor else "https://api.internal"

        # 1. AI Triage
        triage_res = await self.triage_agent.triage_incident(
            monitor_name=monitor_name,
            url=monitor_url,
            status_code=status_code,
            error_text=error_snippet
        )

        # 2. AI Root Cause Analysis
        rca_res = await self.rca_agent.analyze_root_cause(
            url=monitor_url,
            status_code=status_code,
            response_time_ms=response_time_ms,
            error_snippet=error_snippet
        )

        # 3. AI Remediation Plan
        title = f"High Latency Outage on {monitor_name}"
        rem_res = await self.remediation_agent.generate_remediation_plan(
            incident_title=title,
            root_cause=rca_res["probable_root_cause"]
        )

        incident_number = f"INC-{int(datetime.utcnow().timestamp()) % 100000}"
        incident = Incident(
            monitor_id=monitor_id,
            incident_number=incident_number,
            title=title,
            severity=triage_res["severity"],
            status="INVESTIGATING",
            root_cause_summary=rca_res["probable_root_cause"],
            ai_remediation_plan="\n".join([f"• {s}" for s in rem_res["action_steps"]]),
            affected_components=rca_res["affected_layer"],
            started_at=datetime.utcnow()
        )
        self.db.add(incident)
        self.db.commit()
        self.db.refresh(incident)

        # 4. Dispatch Alerts
        alert_content = await self.notification_agent.format_alert({
            "title": incident.title,
            "severity": incident.severity,
            "url": monitor_url
        })
        await self.slack_client.post_incident_notification("#production-alerts", alert_content["slack_message"], incident.severity)
        await self.email_client.send_incident_alert("sre-oncall@enterprise.net", alert_content["email_subject"], alert_content["email_body"])

        return incident

    def get_incidents(
        self,
        monitor_id: Optional[int] = None,
        severity: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[Incident]:
        query = self.db.query(Incident)
        if monitor_id:
            query = query.filter(Incident.monitor_id == monitor_id)
        if severity and severity != "ALL":
            query = query.filter(Incident.severity == severity)
        if status and status != "ALL":
            query = query.filter(Incident.status == status)
        return query.order_by(Incident.started_at.desc()).all()

    def get_incident(self, incident_id: int) -> Optional[Incident]:
        return self.db.query(Incident).filter(Incident.id == incident_id).first()

    def update_incident(self, incident_id: int, update_data: IncidentUpdate) -> Optional[Incident]:
        inc = self.get_incident(incident_id)
        if not inc:
            return None
        data = update_data.model_dump(exclude_unset=True)
        for key, val in data.items():
            setattr(inc, key, val)
        if update_data.status == "RESOLVED" and not inc.resolved_at:
            inc.resolved_at = datetime.utcnow()
            inc.duration_minutes = round((inc.resolved_at - inc.started_at).total_seconds() / 60.0, 1)
        self.db.commit()
        self.db.refresh(inc)
        return inc
