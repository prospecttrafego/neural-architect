from typing import List
from uuid import UUID
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.file import File
from app.schemas.file import FileCreate, FileUpdate

class CRUDFile(CRUDBase[File, FileCreate, FileUpdate]):
    def get_by_project(self, db: Session, *, project_id: UUID) -> List[File]:
        return db.query(self.model).filter(File.project_id == project_id).all()

file = CRUDFile(File)
