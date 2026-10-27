from typing import Dict, Any, Optional
from app.integrations.llm_client import LLMClient
from app.core.logging_config import logger

class NotificationAgent:
    """Formats incident alert notifications for Slack, Email, and PagerDuty."""

    def __init__(self, llm_client: Optional[LLMClient] = None):
        self.llm = llm_client or LLMClient()

    async def format_alert(self, incident_data: Dict[str, Any]) -> Dict[str, str]:
        title = incident_data.get("title", "Service Outage Detected")
        severity = incident_data.get("severity", "P1")
        url = incident_data.get("url", "https://api.enterprise.internal")
        
        slack_msg = f"🚨 *[{severity} INCIDENT ALERT]*: {title}\n*Target URL*: {url}\n*Status*: INVESTIGATING\n*Time*: Immediate Page Triggered"
        email_subj = f"[{severity} ALERT] Incident Triggered: {title}"
        email_body = f"Incident Notification:\n\nTitle: {title}\nSeverity: {severity}\nURL: {url}\n\nOur automated triage engine has captured diagnostics and alerted the on-call engineer."

        return {
            "slack_message": slack_msg,
            "email_subject": email_subj,
            "email_body": email_body
        }
