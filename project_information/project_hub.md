## 8. FEATURE 1: PROJECT HUB

### 8.1 API Endpoints

```python
# backend/app/api/v1/endpoints/projects.py
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.api.v1.schemas.project import (
    ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse
)
from app.services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=ProjectListResponse)
async def list_projects(
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search by name"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """List all projects with optional filters."""
    service = ProjectService(db)
    return await service.list_projects(
        category=category,
        status=status,
        search=search,
        page=page,
        page_size=page_size
    )


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    data: ProjectCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new project."""
    service = ProjectService(db)
    return await service.create_project(data)


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a single project by ID."""
    service = ProjectService(db)
    project = await service.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    data: ProjectUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a project."""
    service = ProjectService(db)
    project = await service.update_project(project_id, data)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete a project."""
    service = ProjectService(db)
    success = await service.delete_project(project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")


@router.post("/{project_id}/access", response_model=ProjectResponse)
async def mark_project_accessed(
    project_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Mark a project as recently accessed."""
    service = ProjectService(db)
    project = await service.mark_accessed(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
```

### 8.2 Project Service

```python
# backend/app/services/project_service.py
from typing import Optional
from uuid import UUID
from datetime import datetime
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.project import Project
from app.api.v1.schemas.project import (
    ProjectCreate, ProjectUpdate, ProjectListResponse
)


class ProjectService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def list_projects(
        self,
        category: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> ProjectListResponse:
        query = select(Project)
        
        # Apply filters
        if category:
            query = query.where(Project.category == category)
        if status:
            query = query.where(Project.status == status)
        if search:
            query = query.where(
                or_(
                    Project.name.ilike(f"%{search}%"),
                    Project.description.ilike(f"%{search}%")
                )
            )
        
        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total = await self.db.scalar(count_query)
        
        # Apply pagination
        query = query.order_by(Project.last_accessed_at.desc().nullslast())
        query = query.offset((page - 1) * page_size).limit(page_size)
        
        result = await self.db.execute(query)
        projects = result.scalars().all()
        
        return ProjectListResponse(
            items=projects,
            total=total or 0,
            page=page,
            page_size=page_size,
            total_pages=(total or 0 + page_size - 1) // page_size
        )
    
    async def create_project(self, data: ProjectCreate) -> Project:
        project = Project(
            name=data.name,
            description=data.description,
            category=data.category
        )
        self.db.add(project)
        await self.db.commit()
        await self.db.refresh(project)
        return project
    
    async def get_project(self, project_id: UUID) -> Optional[Project]:
        query = select(Project).where(Project.id == project_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def update_project(
        self, 
        project_id: UUID, 
        data: ProjectUpdate
    ) -> Optional[Project]:
        project = await self.get_project(project_id)
        if not project:
            return None
        
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(project, field, value)
        
        await self.db.commit()
        await self.db.refresh(project)
        return project
    
    async def delete_project(self, project_id: UUID) -> bool:
        project = await self.get_project(project_id)
        if not project:
            return False
        
        await self.db.delete(project)
        await self.db.commit()
        return True
    
    async def mark_accessed(self, project_id: UUID) -> Optional[Project]:
        project = await self.get_project(project_id)
        if not project:
            return None
        
        project.last_accessed_at = datetime.utcnow()
        await self.db.commit()
        await self.db.refresh(project)
        return project
```

### 8.3 Frontend Hook

```typescript
// frontend/src/hooks/useProjects.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { 
  Project, 
  CreateProject, 
  UpdateProject, 
  ProjectCategory 
} from '@/schemas';

interface UseProjectsParams {
  category?: ProjectCategory;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

interface ProjectsResponse {
  items: Project[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function useProjects(params: UseProjectsParams = {}) {
  const { category, status, search, page = 1, pageSize = 20 } = params;

  return useQuery<ProjectsResponse>({
    queryKey: ['projects', { category, status, search, page, pageSize }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (category) searchParams.set('category', category);
      if (status) searchParams.set('status', status);
      if (search) searchParams.set('search', search);
      searchParams.set('page', String(page));
      searchParams.set('page_size', String(pageSize));

      const response = await api.get(`/projects?${searchParams}`);
      return response.data;
    },
  });
}

export function useProject(projectId: string | undefined) {
  return useQuery<Project>({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    },
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProject) => {
      const response = await api.post('/projects', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProject }) => {
      const response = await api.patch(`/projects/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      await api.delete(`/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
```

### 8.4 Project Card Component

```tsx
// frontend/src/components/projects/ProjectCard.tsx
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Project } from '@/schemas';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

const categoryConfig = {
  software: { label: 'Software', color: 'bg-indigo-100 text-indigo-700' },
  agents: { label: 'Agents', color: 'bg-violet-100 text-violet-700' },
  automation: { label: 'Automação', color: 'bg-emerald-100 text-emerald-700' },
};

const statusConfig = {
  draft: { label: 'Rascunho', color: 'text-gray-600' },
  in_progress: { label: 'Em Progresso', color: 'text-blue-600' },
  review: { label: 'Revisão', color: 'text-amber-600' },
  completed: { label: 'Concluído', color: 'text-green-600' },
  archived: { label: 'Arquivado', color: 'text-gray-400' },
};

export const ProjectCard = memo(function ProjectCard({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const navigate = useNavigate();
  const category = categoryConfig[project.category];
  const status = statusConfig[project.status];

  const handleClick = () => {
    navigate(`/${project.category}/${project.id}`);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 group"
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 truncate">
            {project.name}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={`${category.color} hover:${category.color}`}>
            {category.label}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={handleMenuClick}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(project)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(project)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-500 text-sm line-clamp-2">
          {project.description || 'Sem descrição'}
        </p>

        {/* Progress Bar */}
        {project.progress > 0 && (
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        )}

        <div className="flex justify-between items-center text-sm">
          <span className={`font-medium ${status.color}`}>
            {status.label}
          </span>
          <span className="text-gray-400">
            {formatDistanceToNow(new Date(project.updatedAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
});
```

### 8.5 Create Project Modal

```tsx
// frontend/src/components/projects/CreateProjectModal.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Monitor, Bot, Phone, Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreateProjectSchema, type CreateProject, type ProjectCategory } from '@/schemas';
import { useCreateProject } from '@/hooks/useProjects';
import { toast } from 'sonner';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: ProjectCategory;
}

const categories = [
  {
    value: 'software' as const,
    label: 'Software / SaaS',
    description: 'Web apps, APIs, dashboards',
    icon: Monitor,
  },
  {
    value: 'agents' as const,
    label: 'Multi-Agents IA',
    description: 'Sistemas de agentes inteligentes',
    icon: Bot,
  },
  {
    value: 'automation' as const,
    label: 'Automação',
    description: 'SDR, Closer, Suporte',
    icon: Phone,
  },
];

export function CreateProjectModal({
  open,
  onOpenChange,
  defaultCategory,
}: CreateProjectModalProps) {
  const createProject = useCreateProject();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateProject>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      category: defaultCategory || 'software',
    },
  });

  const selectedCategory = watch('category');

  const onSubmit = async (data: CreateProject) => {
    try {
      await createProject.mutateAsync(data);
      toast.success('Projeto criado com sucesso!');
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao criar projeto');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Projeto *</Label>
            <Input
              id="name"
              placeholder="Ex: Meu App Incrível"
              {...register('name')}
              autoFocus
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Uma breve descrição do projeto..."
              rows={3}
              {...register('description')}
            />
          </div>

          {/* Category */}
          <div className="space-y-3">
            <Label>Categoria *</Label>
            <RadioGroup
              value={selectedCategory}
              onValueChange={(value) => setValue('category', value as ProjectCategory)}
              className="grid grid-cols-1 gap-3"
            >
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.value;
                
                return (
                  <label
                    key={cat.value}
                    className={`
                      flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer
                      transition-all duration-200
                      ${isSelected 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <RadioGroupItem value={cat.value} className="sr-only" />
                    <div className={`
                      p-2 rounded-lg
                      ${isSelected ? 'bg-indigo-100' : 'bg-gray-100'}
                    `}>
                      <Icon className={`h-5 w-5 ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{cat.label}</p>
                      <p className="text-sm text-gray-500">{cat.description}</p>
                    </div>
                  </label>
                );
              })}
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isValid || createProject.isPending}
            >
              {createProject.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Criar Projeto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### 8.6 Category Hub Page

```tsx
// frontend/src/app/software/page.tsx
import { useState } from 'react';
import { Plus, Search, BookOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { KnowledgeBase } from '@/components/knowledge/KnowledgeBase';
import { useProjects } from '@/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';

export default function SoftwareHubPage() {
  const [search, setSearch] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');

  const { data, isLoading } = useProjects({
    category: 'software',
    search: search || undefined,
  });

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Software & SaaS
          </h1>
          <p className="text-gray-500 mt-1">
            Crie produtos digitais completos com metodologia guiada
          </p>
        </div>
        
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Tabs: Projects / Knowledge Base */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="projects">Meus Projetos</TabsTrigger>
          <TabsTrigger value="knowledge">
            <BookOpen className="h-4 w-4 mr-2" />
            Metodologia & Guias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar projetos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          ) : data?.items.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum projeto ainda
              </h3>
              <p className="text-gray-500 mb-4">
                Comece criando seu primeiro projeto de software
              </p>
              <Button onClick={() => setCreateModalOpen(true)}>
                Criar Primeiro Projeto
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.items.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="knowledge">
          <KnowledgeBase category="software" />
        </TabsContent>
      </Tabs>

      {/* Create Modal */}
      <CreateProjectModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        defaultCategory="software"
      />
    </div>
  );
}
```