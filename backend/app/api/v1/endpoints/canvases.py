from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.crud import canvas as crud_canvas
from app.schemas import canvas as schema_canvas

router = APIRouter()

@router.get("/", response_model=List[schema_canvas.Canvas])
def read_canvases(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve canvases.
    """
    # TODO: Filter by user permissions if needed via project
    canvases = crud_canvas.canvas.get_multi(db, skip=skip, limit=limit)
    return canvases

@router.post("/", response_model=schema_canvas.Canvas)
def create_canvas(
    *,
    db: Session = Depends(deps.get_db),
    canvas_in: schema_canvas.CanvasCreate,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new canvas.
    """
    canvas = crud_canvas.canvas.create(db=db, obj_in=canvas_in)
    return canvas

@router.get("/{canvas_id}", response_model=schema_canvas.Canvas)
def read_canvas(
    *,
    db: Session = Depends(deps.get_db),
    canvas_id: UUID,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get canvas by ID.
    """
    canvas = crud_canvas.canvas.get(db=db, id=canvas_id)
    if not canvas:
        raise HTTPException(status_code=404, detail="Canvas not found")
    return canvas

@router.put("/{canvas_id}", response_model=schema_canvas.Canvas)
def update_canvas(
    *,
    db: Session = Depends(deps.get_db),
    canvas_id: UUID,
    canvas_in: schema_canvas.CanvasUpdate,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a canvas.
    """
    canvas = crud_canvas.canvas.get(db=db, id=canvas_id)
    if not canvas:
        raise HTTPException(status_code=404, detail="Canvas not found")
    canvas = crud_canvas.canvas.update(db=db, db_obj=canvas, obj_in=canvas_in)
    return canvas

@router.delete("/{canvas_id}", response_model=schema_canvas.Canvas)
def delete_canvas(
    *,
    db: Session = Depends(deps.get_db),
    canvas_id: UUID,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a canvas.
    """
    canvas = crud_canvas.canvas.get(db=db, id=canvas_id)
    if not canvas:
        raise HTTPException(status_code=404, detail="Canvas not found")
    canvas = crud_canvas.canvas.remove(db=db, id=canvas_id)
    return canvas
