from typing import List, Optional, Any
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class FileBase(BaseModel):
    filename: str
    content_type: str
    size: int
    path: str
    url: Optional[str] = None

class FileCreate(FileBase):
    project_id: UUID
    uploaded_by: UUID

class FileUpdate(FileBase):
    pass

class FileInDBBase(FileBase):
    id: UUID
    project_id: UUID
    uploaded_by: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class File(FileInDBBase):
    pass
