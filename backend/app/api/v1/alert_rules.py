from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import verify_api_key
from app.schemas.alert_rule import AlertRuleCreate, AlertRuleUpdate, AlertRuleResponse
from app.services.alert_service import AlertService

router = APIRouter(prefix="/alert-rules", tags=["Alert Rules"], dependencies=[Depends(verify_api_key)])

@router.get("", response_model=List[AlertRuleResponse])
def list_rules(db: Session = Depends(get_db)):
    service = AlertService(db)
    return service.get_rules()

@router.post("", response_model=AlertRuleResponse, status_code=status.HTTP_201_CREATED)
def create_rule(rule_in: AlertRuleCreate, db: Session = Depends(get_db)):
    service = AlertService(db)
    return service.create_rule(rule_in)

@router.patch("/{rule_id}", response_model=AlertRuleResponse)
def update_rule(rule_id: int, update_in: AlertRuleUpdate, db: Session = Depends(get_db)):
    service = AlertService(db)
    rule = service.update_rule(rule_id, update_in)
    if not rule:
        raise HTTPException(status_code=404, detail="Alert rule not found")
    return rule

@router.delete("/{rule_id}")
def delete_rule(rule_id: int, db: Session = Depends(get_db)):
    service = AlertService(db)
    if not service.delete_rule(rule_id):
        raise HTTPException(status_code=404, detail="Alert rule not found")
    return {"status": "DELETED", "id": rule_id}
