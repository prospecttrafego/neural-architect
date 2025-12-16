from pathlib import Path
from agno.knowledge import Knowledge
from agno.vectordb.lancedb import LanceDb
from app.config import settings

def get_embedder():
    # Using OpenAI for quality if available
    return OpenAIEmbedder(id="text-embedding-3-small", dimensions=1536)

def get_knowledge_base():
    # Store locally in ./data/lancedb
    db_path = Path("data/lancedb")
    db_path.parent.mkdir(parents=True, exist_ok=True)
    
    vector_db = LanceDb(
        table_name="general_knowledge",
        uri=str(db_path),
    )
    
    # Knowledge base using LanceDb as vector store
    knowledge_base = Knowledge(
        vector_db=vector_db,
        # Optional: num_documents=5 (default)
    )
    return knowledge_base
