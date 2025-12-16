from typing import List, Optional, Any
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from enum import Enum

class KnowledgeCategory(str, Enum):
    methodology = "methodology"
    pattern = "pattern"
    template = "template"
    checklist = "checklist"

class KnowledgeArticleBase(BaseModel):
    title: str
    slug: str
    category: KnowledgeCategory
    subcategory: Optional[str] = None
    content: str
    tags: Optional[str] = None
    vertical: Optional[str] = "software"

class KnowledgeArticleCreate(KnowledgeArticleBase):
    pass

class KnowledgeArticleUpdate(KnowledgeArticleBase):
    title: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[KnowledgeCategory] = None
    content: Optional[str] = None

class KnowledgeArticleInDBBase(KnowledgeArticleBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class KnowledgeArticle(KnowledgeArticleInDBBase):
    pass
