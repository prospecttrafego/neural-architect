import uuid
import enum
from sqlalchemy import Column, String, ForeignKey, Integer, Enum, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base

class KnowledgeCategory(str, enum.Enum):
    methodology = "methodology"
    pattern = "pattern"
    template = "template"
    checklist = "checklist"

class KnowledgeArticle(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    category = Column(Enum(KnowledgeCategory), nullable=False)
    subcategory = Column(String, nullable=True)
    content = Column(Text, nullable=False)  # Markdown
    tags = Column(String, nullable=True)    # Comma separated
    
    vertical = Column(String, default="software") # software, agents, automation
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
