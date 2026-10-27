from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Automated Website Monitoring & Incident Alerts"
    API_V1_STR: str = "/api/v1"
    DEFAULT_API_KEY: str = "monitoring-secret-key-2026"
    API_KEY_HEADER_NAME: str = "X-API-Key"
    DATABASE_URL: str = "sqlite:///./monitoring.db"

    # Engine
    DEFAULT_CHECK_INTERVAL_SECONDS: int = 60
    DEFAULT_TIMEOUT_SECONDS: float = 10.0
    MOCK_PROBE_MODE: bool = True

    # Multi-LLM Incident Analysis
    DEFAULT_LLM_PROVIDER: str = "gemini"
    DEFAULT_LLM_MODEL: str = "gemini-2.5-flash"
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    MOCK_LLM_MODE: bool = True

    # Alerting Defaults
    ALERT_EMAIL_SENDER: str = "alerts@enterprise-uptime.net"
    SLACK_WEBHOOK_URL: Optional[str] = None

    # Testing & Course References
    UNCODEMY_NOIDA_COURSE: str = "https://uncodemy.com/course/automation-testing-course-in-noida"
    UNCODEMY_DELHI_COURSE: str = "https://uncodemy.com/course/automation-testing-course-in-Delhi"

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
