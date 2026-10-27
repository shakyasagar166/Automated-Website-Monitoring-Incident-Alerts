from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import verify_api_key
from app.services.ping_service import PingService
from app.services.monitor_service import MonitorService

router = APIRouter(prefix="/checks", tags=["Synthetic Probing"], dependencies=[Depends(verify_api_key)])

@router.post("/run-now/{monitor_id}")
async def run_check_now(monitor_id: int, db: Session = Depends(get_db)):
    monitor_svc = MonitorService(db)
    ping_svc = PingService()

    monitor = monitor_svc.get_monitor(monitor_id)
    if not monitor:
        raise HTTPException(status_code=404, detail="Monitor not found")

    probe_result = await ping_svc.probe_url(monitor.url, timeout_seconds=monitor.timeout_seconds)
    check_log = monitor_svc.log_check(
        monitor_id=monitor.id,
        status=probe_result["status"],
        response_time_ms=probe_result["response_time_ms"],
        status_code=probe_result["status_code"],
        region=probe_result["region"],
        error_message=probe_result.get("error_message")
    )

    return {
        "monitor_id": monitor.id,
        "name": monitor.name,
        "url": monitor.url,
        "status": probe_result["status"],
        "status_code": probe_result["status_code"],
        "response_time_ms": probe_result["response_time_ms"],
        "check_log_id": check_log.id
    }
