import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, DateTime
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base

class File(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    filename = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    size = Column(Integer, nullable=False)
    path = Column(String, nullable=False)  # S3 path or local path
    url = Column(String, nullable=True)    # Public URL if available
    
    project_id = Column(UUID(as_uuid=True), ForeignKey("project.id"))
    project = relationship("Project", backref="files")
    
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("user.id"))
    uploader = relationship("User")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
