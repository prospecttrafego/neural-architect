from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.knowledge import KnowledgeArticle
from app.schemas.knowledge import KnowledgeArticleCreate, KnowledgeArticleUpdate

class CRUDKnowledge(CRUDBase[KnowledgeArticle, KnowledgeArticleCreate, KnowledgeArticleUpdate]):
    def get_by_slug(self, db: Session, *, slug: str) -> Optional[KnowledgeArticle]:
        return db.query(self.model).filter(KnowledgeArticle.slug == slug).first()

    def get_by_category(self, db: Session, *, category: str) -> List[KnowledgeArticle]:
        return db.query(self.model).filter(KnowledgeArticle.category == category).all()

knowledge = CRUDKnowledge(KnowledgeArticle)
