from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.crud import document as crud_document
from app.schemas import document as schema_document

router = APIRouter()

@router.get("/", response_model=List[schema_document.Document])
def read_documents(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve documents.
    """
    documents = crud_document.document.get_multi(db, skip=skip, limit=limit)
    return documents

@router.post("/", response_model=schema_document.Document)
def create_document(
    *,
    db: Session = Depends(deps.get_db),
    document_in: schema_document.DocumentCreate,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new document.
    """
    document = crud_document.document.create(db=db, obj_in=document_in)
    return document

@router.get("/{document_id}", response_model=schema_document.Document)
def read_document(
    *,
    db: Session = Depends(deps.get_db),
    document_id: UUID,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get document by ID.
    """
    document = crud_document.document.get(db=db, id=document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@router.put("/{document_id}", response_model=schema_document.Document)
def update_document(
    *,
    db: Session = Depends(deps.get_db),
    document_id: UUID,
    document_in: schema_document.DocumentUpdate,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a document.
    """
    document = crud_document.document.get(db=db, id=document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    document = crud_document.document.update(db=db, db_obj=document, obj_in=document_in)
    return document

@router.delete("/{document_id}", response_model=schema_document.Document)
def delete_document(
    *,
    db: Session = Depends(deps.get_db),
    document_id: UUID,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a document.
    """
    document = crud_document.document.get(db=db, id=document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    document = crud_document.document.remove(db=db, id=document_id)
    return document

@router.get("/project/{project_id}", response_model=List[schema_document.Document])
def read_project_documents(
    *,
    db: Session = Depends(deps.get_db),
    project_id: UUID,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get all documents for a project.
    """
    documents = crud_document.document.get_by_project(db=db, project_id=project_id)
    return documents
