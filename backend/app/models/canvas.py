import uuid
from sqlalchemy import Column, String, ForeignKey, JSON, DateTime, Boolean
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base

class Canvas(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, default="Main Canvas")
    
    # Store React Flow nodes and edges as JSON
    nodes = Column(JSON, default=[])
    edges = Column(JSON, default=[])
    viewport = Column(JSON, default={"x": 0, "y": 0, "zoom": 1})
    
    is_main = Column(Boolean, default=False)
    
    project_id = Column(UUID(as_uuid=True), ForeignKey("project.id"))
    project = relationship("Project", backref="canvases")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
