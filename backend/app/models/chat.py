import uuid
import enum
from sqlalchemy import Column, String, ForeignKey, JSON, DateTime, Enum, Text
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base

class MessageRole(str, enum.Enum):
    user = "user"
    assistant = "assistant"
    system = "system"
    tool = "tool"

class ChatSession(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String, nullable=True)
    
    project_id = Column(UUID(as_uuid=True), ForeignKey("project.id"))
    project = relationship("Project", backref="chat_sessions")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ChatMessage(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    role = Column(Enum(MessageRole), nullable=False)
    content = Column(Text, nullable=False)
    
    # Tool calls and extra metadata
    tool_calls = Column(JSON, nullable=True)
    tool_results = Column(JSON, nullable=True)
    metadata_ = Column("metadata", JSON, default={})
    
    session_id = Column(UUID(as_uuid=True), ForeignKey("chatsession.id"))
    session = relationship("ChatSession", backref="messages")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
