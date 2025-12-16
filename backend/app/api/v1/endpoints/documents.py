from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.api.deps import get_db
from backend.app.services.document_service import DocumentService
from backend.app.schemas.document import DocumentResponse, DocumentGenerateRequest

router = APIRouter()
document_service = DocumentService()

@router.post("/generate", response_model=DocumentResponse)
async def generate_document(
    request: DocumentGenerateRequest,
    db: Session = Depends(get_db)
):
    try:
        return await document_service.generate_document(db, str(request.project_id), request.type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[DocumentResponse])
def list_documents(
    project_id: str,
    db: Session = Depends(get_db)
):
    return document_service.get_by_project(db, project_id)

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: str,
    db: Session = Depends(get_db)
):
    doc = document_service.get(db, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc
