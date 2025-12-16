from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.api.deps import get_db
from backend.app.ai.agents.partner_agent import PartnerAgent
from backend.app.schemas.chat import ChatRequest
from fastapi.responses import StreamingResponse

router = APIRouter()

@router.post("/chat")
async def chat_with_partner(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Chat with the Partner Agent (streaming response).
    """
    project_id = request.project_id
    message = request.message
    
    agent = PartnerAgent(db)
    
    # Run the agent in streaming mode
    # Agno streams return a generator of chunks
    response_stream = agent.chat(message, project_id, stream=True)
    
    return StreamingResponse(
        content=response_stream,
        media_type="text/event-stream"
    )
