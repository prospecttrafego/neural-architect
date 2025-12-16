from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.crud.canvas import canvas as canvas_crud
from backend.app.schemas.canvas import CanvasCreate, CanvasUpdate
from backend.app.models.canvas import Canvas

class CanvasService:
    def get_by_project_id(self, db: Session, project_id: str) -> Canvas | None:
        # Assuming we have a way to find canvas by project
        # If the relationship is 1:1, we can query by project_id
        # Check if CRUD has get_by_project
        return canvas_crud.get_by_project_id(db, project_id=project_id)

    async def get_by_project_id_async(self, db: AsyncSession, project_id: str) -> Canvas | None:
        return await canvas_crud.get_by_project_id_async(db, project_id=project_id)

    def create_canvas(self, db: Session, obj_in: CanvasCreate) -> Canvas:
        return canvas_crud.create(db, obj_in=obj_in)

    def update_canvas(self, db: Session, db_obj: Canvas, obj_in: CanvasUpdate) -> Canvas:
        return canvas_crud.update(db, db_obj=db_obj, obj_in=obj_in)
