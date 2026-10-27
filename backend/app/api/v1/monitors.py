from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import verify_api_key
from app.schemas.monitor import MonitorCreate, MonitorUpdate, MonitorResponse, CheckLogResponse
from app.services.monitor_service import MonitorService

router = APIRouter(prefix="/monitors", tags=["Monitors"], dependencies=[Depends(verify_api_key)])

@router.get("", response_model=List[MonitorResponse])
def list_monitors(status: Optional[str] = Query(None), db: Session = Depends(get_db)):
    service = MonitorService(db)
    return service.get_monitors(status=status)

@router.post("", response_model=MonitorResponse, status_code=status.HTTP_201_CREATED)
def create_monitor(monitor_in: MonitorCreate, db: Session = Depends(get_db)):
    service = MonitorService(db)
    return service.create_monitor(monitor_in)

@router.get("/{monitor_id}", response_model=MonitorResponse)
def get_monitor(monitor_id: int, db: Session = Depends(get_db)):
    service = MonitorService(db)
    m = service.get_monitor(monitor_id)
    if not m:
        raise HTTPException(status_code=404, detail="Monitor not found")
    return m

@router.patch("/{monitor_id}", response_model=MonitorResponse)
def update_monitor(monitor_id: int, update_in: MonitorUpdate, db: Session = Depends(get_db)):
    service = MonitorService(db)
    m = service.update_monitor(monitor_id, update_in)
    if not m:
        raise HTTPException(status_code=404, detail="Monitor not found")
    return m
