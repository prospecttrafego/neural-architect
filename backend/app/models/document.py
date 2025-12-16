import uuid
import enum
from sqlalchemy import Column, String, ForeignKey, DateTime, Enum, Text
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base

class DocumentType(str, enum.Enum):
    TIS = "TIS"
    PRD = "PRD"
    ARCHITECTURE = "ARCHITECTURE"
    AGENT_SPEC = "AGENT_SPEC"
    FLOW_SPEC = "FLOW_SPEC"
    OTHER = "OTHER"

class Document(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String, nullable=False)
    type = Column(Enum(DocumentType), nullable=False)
    content = Column(Text, nullable=True)  # Markdown content
    version = Column(String, default="1.0")
    
    project_id = Column(UUID(as_uuid=True), ForeignKey("project.id"))
    project = relationship("Project", backref="documents")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
