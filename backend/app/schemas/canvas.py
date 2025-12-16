from typing import List, Optional, Any, Dict
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class CanvasBase(BaseModel):
    name: Optional[str] = "Main Canvas"
    nodes: Optional[List[Dict[str, Any]]] = []
    edges: Optional[List[Dict[str, Any]]] = []
    viewport: Optional[Dict[str, Any]] = {"x": 0, "y": 0, "zoom": 1}
    is_main: Optional[bool] = False

class CanvasCreate(CanvasBase):
    project_id: UUID

class CanvasUpdate(CanvasBase):
    pass

class CanvasInDBBase(CanvasBase):
    id: UUID
    project_id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Canvas(CanvasInDBBase):
    pass
