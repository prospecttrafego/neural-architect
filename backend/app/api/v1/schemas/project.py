from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel
from app.models.project import ProjectCategory, ProjectStatus

# Shared properties
class ProjectBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[ProjectCategory] = None
    status: Optional[ProjectStatus] = ProjectStatus.draft
    settings: Optional[dict[str, Any]] = None

# Properties to receive on creation
class ProjectCreate(ProjectBase):
    name: str
    category: ProjectCategory

# Properties to receive on update
class ProjectUpdate(ProjectBase):
    pass

# Properties shared by models stored in DB
class ProjectInDBBase(ProjectBase):
    id: str
    created_at: datetime
    updated_at: datetime
    owner_id: str

    class Config:
        from_attributes = True

# Properties to return to client
class Project(ProjectInDBBase):
    pass

class ProjectInDB(ProjectInDBBase):
    pass
