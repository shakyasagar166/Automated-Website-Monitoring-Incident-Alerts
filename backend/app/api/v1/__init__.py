from fastapi import APIRouter
from app.api.v1.monitors import router as monitors_router
from app.api.v1.incidents import router as incidents_router
from app.api.v1.alert_rules import router as alert_rules_router
from app.api.v1.checks import router as checks_router
from app.api.v1.analytics import router as analytics_router

api_v1_router = APIRouter()
api_v1_router.include_router(monitors_router)
api_v1_router.include_router(incidents_router)
api_v1_router.include_router(alert_rules_router)
api_v1_router.include_router(checks_router)
api_v1_router.include_router(analytics_router)
