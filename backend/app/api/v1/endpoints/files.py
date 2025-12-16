import shutil
import os
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File as FastAPIFile, Form
from sqlalchemy.orm import Session
from uuid import UUID
import uuid

from app.api import deps
from app.crud import file as crud_file
from app.schemas import file as schema_file

router = APIRouter()

UPLOAD_DIR = "data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=schema_file.File)
async def upload_file(
    *,
    db: Session = Depends(deps.get_db),
    project_id: UUID = Form(...),
    file: UploadFile = FastAPIFile(...),
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload a file.
    """
    # Generate unique filename to avoid collisions
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Create DB entry
    file_in = schema_file.FileCreate(
        filename=file.filename,
        content_type=file.content_type,
        size=os.path.getsize(file_path),
        path=file_path,
        url=f"/static/uploads/{unique_filename}", # Assuming we serve this via static
        project_id=project_id,
        uploaded_by=current_user.id
    )
    
    db_file = crud_file.file.create(db=db, obj_in=file_in)
    return db_file

@router.get("/project/{project_id}", response_model=List[schema_file.File])
def read_project_files(
    *,
    db: Session = Depends(deps.get_db),
    project_id: UUID,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get all files for a project.
    """
    files = crud_file.file.get_by_project(db=db, project_id=project_id)
    return files

@router.delete("/{file_id}", response_model=schema_file.File)
def delete_file(
    *,
    db: Session = Depends(deps.get_db),
    file_id: UUID,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a file.
    """
    db_file = crud_file.file.get(db=db, id=file_id)
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Check permissions (only uploader or admin?) - for now open
    
    # Remove from disk
    if os.path.exists(db_file.path):
        os.remove(db_file.path)
        
    db_file = crud_file.file.remove(db=db, id=file_id)
    return db_file
