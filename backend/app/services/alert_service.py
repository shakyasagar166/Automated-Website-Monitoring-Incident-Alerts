from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.alert_rule import AlertRule
from app.schemas.alert_rule import AlertRuleCreate, AlertRuleUpdate

class AlertService:
    def __init__(self, db: Session):
        self.db = db

    def create_rule(self, rule_data: AlertRuleCreate) -> AlertRule:
        rule = AlertRule(**rule_data.model_dump())
        self.db.add(rule)
        self.db.commit()
        self.db.refresh(rule)
        return rule

    def get_rules(self) -> List[AlertRule]:
        return self.db.query(AlertRule).order_by(AlertRule.created_at.desc()).all()

    def update_rule(self, rule_id: int, update_data: AlertRuleUpdate) -> Optional[AlertRule]:
        rule = self.db.query(AlertRule).filter(AlertRule.id == rule_id).first()
        if not rule:
            return None
        data = update_data.model_dump(exclude_unset=True)
        for key, val in data.items():
            setattr(rule, key, val)
        self.db.commit()
        self.db.refresh(rule)
        return rule

    def delete_rule(self, rule_id: int) -> bool:
        rule = self.db.query(AlertRule).filter(AlertRule.id == rule_id).first()
        if not rule:
            return False
        self.db.delete(rule)
        self.db.commit()
        return True
