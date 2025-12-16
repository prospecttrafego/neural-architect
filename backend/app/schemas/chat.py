from typing import List, Optional, Any, Dict
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from enum import Enum

class MessageRole(str, Enum):
    user = "user"
    assistant = "assistant"
    system = "system"
    tool = "tool"

class ChatMessageBase(BaseModel):
    role: MessageRole
    content: str
    tool_calls: Optional[List[Dict[str, Any]]] = None
    tool_results: Optional[List[Dict[str, Any]]] = None
    metadata: Optional[Dict[str, Any]] = {}

class ChatMessageCreate(ChatMessageBase):
    session_id: Optional[UUID] = None

class ChatMessage(ChatMessageBase):
    id: UUID
    session_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChatSessionBase(BaseModel):
    title: Optional[str] = None

class ChatSessionCreate(ChatSessionBase):
    project_id: UUID

class ChatSessionUpdate(ChatSessionBase):
    pass

class ChatSessionInDB(ChatSessionBase):
    id: UUID
    project_id: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class ChatSession(ChatSessionInDB):
    messages: List[ChatMessage] = []
