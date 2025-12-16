from sqlalchemy.orm import Session
from backend.app.models.document import Document
from backend.app.schemas.document import DocumentCreate, DocumentUpdate
from backend.app.ai.generators.tis_generator import TisGenerator
from backend.app.services.canvas_service import CanvasService
from backend.app.services.project_service import ProjectService
import uuid

class DocumentService:
    def __init__(self):
        self.canvas_service = CanvasService()
        self.project_service = ProjectService()
        self.tis_generator = TisGenerator()

    async def generate_document(self, db: Session, project_id: str, type: str) -> Document:
        project = self.project_service.get(db, project_id)
        if not project:
            raise ValueError("Project not found")

        canvas = self.canvas_service.get_by_project_id(db, project_id)
        if not canvas:
            raise ValueError("Canvas not found")
        
        canvas_data = {
            "nodes": canvas.nodes_data,
            "edges": canvas.edges_data
        }

        content = ""
        title = ""

        if type == "TIS":
            content = await self.tis_generator.generate_tis(project.name, project.description, canvas_data)
            title = f"TIS - {project.name}"
        # Add other types here
        else:
            raise ValueError("Unsupported document type")

        document = Document(
            title=title,
            type=type,
            content=content,
            project_id=project_id,
            version="1.0"
        )
        db.add(document)
        db.commit()
        db.refresh(document)
        return document

    def get_by_project(self, db: Session, project_id: str):
        return db.query(Document).filter(Document.project_id == project_id).all()

    def get(self, db: Session, document_id: str):
        return db.query(Document).filter(Document.id == document_id).first()
