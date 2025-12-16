from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.api.v1.schemas import project as project_schemas
from app.services.project_service import project_service
from app.models.user import User
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=List[project_schemas.Project])
async def read_projects(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve projects.
    """
    projects = await project_service.get_multi_by_owner(
        db, owner_id=current_user.id, skip=skip, limit=limit
    )
    return projects

@router.post("/", response_model=project_schemas.Project)
async def create_project(
    *,
    db: AsyncSession = Depends(get_db),
    project_in: project_schemas.ProjectCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new project.
    """
    project = await project_service.create(
        db, obj_in=project_in, owner_id=current_user.id
    )
    return project

@router.get("/{id}", response_model=project_schemas.Project)
async def read_project(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get project by ID.
    """
    project = await project_service.get(db, id=id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return project

@router.put("/{id}", response_model=project_schemas.Project)
async def update_project(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    project_in: project_schemas.ProjectUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update project.
    """
    project = await project_service.get(db, id=id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    project = await project_service.update(db, db_obj=project, obj_in=project_in)
    return project

@router.delete("/{id}", response_model=project_schemas.Project)
async def delete_project(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete project.
    """
    project = await project_service.get(db, id=id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
        
    project = await project_service.remove(db, id=id)
    return project
