import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, Float, Enum, JSON, DateTime
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base
import enum

class ProjectCategory(str, enum.Enum):
    software = "software"
    agents = "agents"
    automation = "automation"

class ProjectStatus(str, enum.Enum):
    draft = "draft"
    in_progress = "in_progress"
    review = "review"
    completed = "completed"
    archived = "archived"

class Project(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    category = Column(Enum(ProjectCategory), nullable=False)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.draft)
    progress = Column(Integer, default=0)
    thumbnail_url = Column(String, nullable=True)
    
    # JSONB columns using JSON for broad compatibility (or JSONB in PG)
    settings = Column(JSON, default={})
    metadata_ = Column("metadata", JSON, default={})  # metadata is a reserved attribute in Base
    
    owner_id = Column(UUID(as_uuid=True), ForeignKey("user.id"))
    owner = relationship("User", backref="projects")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_accessed_at = Column(DateTime(timezone=True), nullable=True)
