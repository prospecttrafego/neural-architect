from typing import List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.project import Project
from app.api.v1.schemas import project as project_schemas

class ProjectService:
    async def get(self, db: AsyncSession, id: str) -> Optional[Project]:
        result = await db.execute(select(Project).where(Project.id == id))
        return result.scalar_one_or_none()

    async def get_multi_by_owner(
        self, db: AsyncSession, owner_id: str, skip: int = 0, limit: int = 100
    ) -> List[Project]:
        result = await db.execute(
            select(Project)
            .where(Project.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def create(
        self, db: AsyncSession, obj_in: project_schemas.ProjectCreate, owner_id: str
    ) -> Project:
        db_obj = Project(
            name=obj_in.name,
            description=obj_in.description,
            category=obj_in.category,
            status=obj_in.status,
            settings=obj_in.settings,
            owner_id=owner_id
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self, db: AsyncSession, *, db_obj: Project, obj_in: project_schemas.ProjectUpdate | dict[str, Any]
    ) -> Project:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
            
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: str) -> Optional[Project]:
        obj = await self.get(db, id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj

project_service = ProjectService()
