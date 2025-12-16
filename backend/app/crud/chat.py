from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.chat import ChatSession, ChatMessage
from app.schemas.chat import ChatSessionCreate, ChatSessionUpdate, ChatMessageCreate

class CRUDChatSession(CRUDBase[ChatSession, ChatSessionCreate, ChatSessionUpdate]):
    def get_by_project(self, db: Session, *, project_id: UUID) -> List[ChatSession]:
        return db.query(self.model).filter(ChatSession.project_id == project_id).all()

class CRUDChatMessage(CRUDBase[ChatMessage, ChatMessageCreate, ChatMessageCreate]): # Update schema same as create for now
    def get_by_session(
        self, db: Session, *, session_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[ChatMessage]:
        return (
            db.query(self.model)
            .filter(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.asc())
            .offset(skip)
            .limit(limit)
            .all()
        )

session = CRUDChatSession(ChatSession)
message = CRUDChatMessage(ChatMessage)
