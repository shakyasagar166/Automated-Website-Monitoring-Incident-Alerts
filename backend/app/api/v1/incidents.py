from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import verify_api_key
from app.schemas.incident import IncidentCreate, IncidentUpdate, IncidentResponse, DiagnoseRequest
from app.services.incident_service import IncidentService

router = APIRouter(prefix="/incidents", tags=["Incidents & War Room"], dependencies=[Depends(verify_api_key)])

@router.get("", response_model=List[IncidentResponse])
def list_incidents(
    monitor_id: Optional[int] = Query(None),
    severity: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    service = IncidentService(db)
    return service.get_incidents(monitor_id=monitor_id, severity=severity, status=status)

@router.post("/trigger", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
async def trigger_incident(req: DiagnoseRequest, db: Session = Depends(get_db)):
    service = IncidentService(db)
    return await service.trigger_incident(
        monitor_id=req.monitor_id,
        status_code=req.error_code,
        error_snippet=req.error_snippet or "Service unreachable",
        response_time_ms=req.response_time_ms
    )

@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(incident_id: int, db: Session = Depends(get_db)):
    service = IncidentService(db)
    inc = service.get_incident(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc

@router.patch("/{incident_id}", response_model=IncidentResponse)
def update_incident(incident_id: int, update_in: IncidentUpdate, db: Session = Depends(get_db)):
    service = IncidentService(db)
    inc = service.update_incident(incident_id, update_in)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc
