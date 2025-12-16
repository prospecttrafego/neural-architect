from app.api.v1.endpoints import auth, users, projects, canvases, partner, documents, knowledge, files

api_router = APIRouter()
api_router.include_router(auth.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(canvases.router, prefix="/canvases", tags=["canvases"])
api_router.include_router(partner.router, prefix="/partner", tags=["partner"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(knowledge.router, prefix="/knowledge", tags=["knowledge"])
api_router.include_router(files.router, prefix="/files", tags=["files"])
