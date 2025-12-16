import os
import sys
import asyncio
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

from app.ai.knowledge.setup import get_knowledge_base

def load_rag():
    print("Initializing Knowledge Base...")
    kb = get_knowledge_base()
    
    root_dir = backend_dir.parent / "knowledge-base"
    if not root_dir.exists():
        print(f"Knowledge base directory not found at {root_dir}")
        return

    print("Loading documents from markdown...")
    # Agno simplifies this - we can load from directory
    # But Agno's load_docs might need specific structure or formats.
    # LanceDbKnowledgeBase needs 'documents'.
    
    # We can use Agno's `MarkdownReader` or similar if available, 
    # or just construct text documents.
    from agno.document import Document
    from agno.document.reader.text import TextReader
    
    docs = []
    
    # Simple walker again
    for knowledge_type in ["software", "agents", "automation"]:
        type_dir = root_dir / knowledge_type
        if not type_dir.exists():
            continue
            
        for path in type_dir.rglob("*.md"):
            print(f"Reading {path.name}...")
            content = path.read_text()
            docs.append(
                 Document(
                     content=content,
                     meta_data={"source": str(path), "filename": path.name, "category": knowledge_type}
                 )
            )
            
    print(f"Loading {len(docs)} documents into vector store...")
    kb.load_documents(docs, upsert=True)
    print("RAG loading complete!")

if __name__ == "__main__":
    load_rag()
