from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class DocumentBase(BaseModel):
    title: str
    type: str
    content: Optional[str] = None
    version: Optional[str] = "1.0"

class DocumentCreate(DocumentBase):
    project_id: UUID

class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class DocumentResponse(DocumentBase):
    id: UUID
    project_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DocumentGenerateRequest(BaseModel):
    project_id: UUID
    type: str
