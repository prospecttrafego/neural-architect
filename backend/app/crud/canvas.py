from typing import List
from uuid import UUID
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.canvas import Canvas
from app.schemas.canvas import CanvasCreate, CanvasUpdate

class CRUDCanvas(CRUDBase[Canvas, CanvasCreate, CanvasUpdate]):
    def get_by_project(self, db: Session, *, project_id: UUID) -> List[Canvas]:
        return db.query(self.model).filter(Canvas.project_id == project_id).all()
        
    def get_main_by_project(self, db: Session, *, project_id: UUID) -> Canvas:
        return db.query(self.model).filter(
            Canvas.project_id == project_id,
            Canvas.is_main == True
        ).first()

canvas = CRUDCanvas(Canvas)
