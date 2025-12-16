from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.crud import knowledge as crud_knowledge
from app.schemas import knowledge as schema_knowledge

router = APIRouter()

@router.get("/", response_model=List[schema_knowledge.KnowledgeArticle])
async def read_knowledge_articles(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    category: str = None,
) -> Any:
    """
    Retrieve knowledge articles.
    """
    if category:
        articles = await crud_knowledge.knowledge.get_by_category(db, category=category)
    else:
        articles = await crud_knowledge.knowledge.get_multi(db, skip=skip, limit=limit)
    return articles

@router.post("/", response_model=schema_knowledge.KnowledgeArticle)
async def create_knowledge_article(
    *,
    db: AsyncSession = Depends(deps.get_db),
    article_in: schema_knowledge.KnowledgeArticleCreate,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new knowledge article.
    """
    article = await crud_knowledge.knowledge.create(db=db, obj_in=article_in)
    return article

@router.get("/{slug}", response_model=schema_knowledge.KnowledgeArticle)
async def read_knowledge_article(
    *,
    db: AsyncSession = Depends(deps.get_db),
    slug: str,
) -> Any:
    """
    Get knowledge article by slug.
    """
    article = await crud_knowledge.knowledge.get_by_slug(db=db, slug=slug)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article
