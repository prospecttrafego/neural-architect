from typing import List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.crud.base import CRUDBase
from app.models.knowledge import KnowledgeArticle
from app.schemas.knowledge import KnowledgeArticleCreate, KnowledgeArticleUpdate

class CRUDKnowledge(CRUDBase[KnowledgeArticle, KnowledgeArticleCreate, KnowledgeArticleUpdate]):
    async def get(self, db: AsyncSession, id: Any) -> Optional[KnowledgeArticle]:
        result = await db.execute(select(self.model).filter(self.model.id == id))
        return result.scalars().first()

    async def get_by_slug(self, db: AsyncSession, *, slug: str) -> Optional[KnowledgeArticle]:
        result = await db.execute(select(self.model).filter(KnowledgeArticle.slug == slug))
        return result.scalars().first()

    async def get_by_category(self, db: AsyncSession, *, category: str) -> List[KnowledgeArticle]:
        result = await db.execute(select(self.model).filter(KnowledgeArticle.category == category))
        return result.scalars().all()

    async def get_multi(self, db: AsyncSession, *, skip: int = 0, limit: int = 100) -> List[KnowledgeArticle]:
        result = await db.execute(select(self.model).offset(skip).limit(limit))
        return result.scalars().all()

    async def create(self, db: AsyncSession, *, obj_in: KnowledgeArticleCreate) -> KnowledgeArticle:
        # Assuming obj_in is Pydantic model
        db_obj = self.model(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(self, db: AsyncSession, *, db_obj: KnowledgeArticle, obj_in: KnowledgeArticleUpdate) -> KnowledgeArticle:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

knowledge = CRUDKnowledge(KnowledgeArticle)
