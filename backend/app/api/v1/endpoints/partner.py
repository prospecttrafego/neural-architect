from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.crud import chat as crud_chat
from app.schemas import chat as schema_chat

router = APIRouter()

@router.post("/sessions/", response_model=schema_chat.ChatSession)
def create_session(
    *,
    db: Session = Depends(deps.get_db),
    session_in: schema_chat.ChatSessionCreate,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new chat session.
    """
    session = crud_chat.session.create(db=db, obj_in=session_in)
    return session

@router.get("/sessions/{session_id}", response_model=schema_chat.ChatSession)
def read_session(
    *,
    db: Session = Depends(deps.get_db),
    session_id: UUID,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get session by ID (includes messages).
    """
    session = crud_chat.session.get(db=db, id=session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/sessions/{session_id}/messages", response_model=schema_chat.ChatMessage)
def create_message(
    *,
    db: Session = Depends(deps.get_db),
    session_id: UUID,
    message_in: schema_chat.ChatMessageCreate,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new message in a session.
    """
    session = crud_chat.session.get(db=db, id=session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    message_in.session_id = session_id
    message = crud_chat.message.create(db=db, obj_in=message_in)
    return message

@router.get("/projects/{project_id}/sessions", response_model=List[schema_chat.ChatSession])
def read_project_sessions(
    *,
    db: Session = Depends(deps.get_db),
    project_id: UUID,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get all chat sessions for a project.
    """
    sessions = crud_chat.session.get_by_project(db=db, project_id=project_id)
    return sessions
