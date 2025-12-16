from typing import List
from uuid import UUID
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentUpdate

class CRUDDocument(CRUDBase[Document, DocumentCreate, DocumentUpdate]):
    def get_by_project(self, db: Session, *, project_id: UUID) -> List[Document]:
        return db.query(self.model).filter(Document.project_id == project_id).all()

    def get_by_project_and_type(self, db: Session, *, project_id: UUID, type: str) -> List[Document]:
        return db.query(self.model).filter(
            Document.project_id == project_id,
            Document.type == type
        ).all()

document = CRUDDocument(Document)
