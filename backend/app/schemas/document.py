from typing import List, Optional, Any, Dict
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from enum import Enum

class DocumentType(str, Enum):
    TIS = "TIS"
    PRD = "PRD"
    ARCHITECTURE = "ARCHITECTURE"
    AGENT_SPEC = "AGENT_SPEC"
    FLOW_SPEC = "FLOW_SPEC"
    OTHER = "OTHER"

class DocumentBase(BaseModel):
    title: str
    type: DocumentType
    content: Optional[str] = None
    version: Optional[str] = "1.0"

class DocumentCreate(DocumentBase):
    project_id: UUID

class DocumentUpdate(DocumentBase):
    title: Optional[str] = None
    type: Optional[DocumentType] = None

class DocumentInDBBase(DocumentBase):
    id: UUID
    project_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Document(DocumentInDBBase):
    pass
