
import os
import sys
import asyncio
import logging
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

from app.database import AsyncSessionLocal
from app.crud.knowledge import knowledge
from app.schemas.knowledge import KnowledgeArticleCreate, KnowledgeArticleUpdate, KnowledgeCategory

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed_knowledge():
    logger.info("Starting knowledge base seeding (Async)...")
    
    db = AsyncSessionLocal()
    try:
        root_dir = backend_dir.parent / "knowledge-base"
        
        if not root_dir.exists():
            logger.error(f"Knowledge base directory not found at {root_dir}")
            return

        logger.info(f"Scanning {root_dir}...")
        
        # Mapping folders to categories
        category_map = {
            "methodology": KnowledgeCategory.methodology,
            "patterns": KnowledgeCategory.pattern,
            "templates": KnowledgeCategory.template,
            "checklists": KnowledgeCategory.checklist
        }

        # Walk through the directory
        for knowledge_type in ["software", "agents", "automation"]:
            type_dir = root_dir / knowledge_type
            if not type_dir.exists():
                continue
                
            for category_name, category_enum in category_map.items():
                cat_dir = type_dir / category_name
                if not cat_dir.exists():
                    continue
                    
                for md_file in cat_dir.glob("*.md"):
                    logger.info(f"Processing {md_file.name}...")
                    content = md_file.read_text()
                    
                    # Simple extraction of title from first line
                    lines = content.split('\n')
                    title = lines[0].replace('#', '').strip() if lines else md_file.stem
                    slug = md_file.stem.lower().replace(' ', '-')
                    
                    article_in = KnowledgeArticleCreate(
                        title=title,
                        slug=slug,
                        category=category_enum,
                        content=content,
                        vertical=knowledge_type,
                        tags=knowledge_type
                    )
                    
                    # Check existing
                    existing = await knowledge.get_by_slug(db, slug=slug)
                    
                    if existing:
                        logger.info(f"Updating existing article: {slug}")
                        # We need an update schema or simple update
                        update_in = KnowledgeArticleUpdate(**article_in.model_dump())
                        await knowledge.update(db, db_obj=existing, obj_in=update_in)
                    else:
                        logger.info(f"Creating new article: {slug}")
                        await knowledge.create(db, obj_in=article_in)
    
    except Exception as e:
        logger.error(f"Seeding failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await db.close()
    
    logger.info("Knowledge base seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed_knowledge())
