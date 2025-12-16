import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Project, ProjectCreate, ProjectUpdate } from '../types/project.types';

const PROJECTS_QUERY_KEY = ['projects'];

export function useProjects() {
    const queryClient = useQueryClient();

    const projectsQuery = useQuery({
        queryKey: PROJECTS_QUERY_KEY,
        queryFn: async () => {
            const response = await api.get<Project[]>('/projects/');
            return response;
        },
    });

    const createProject = useMutation({
        mutationFn: async (newProject: ProjectCreate) => {
            const response = await api.post<Project>('/projects/', newProject);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
        },
    });

    const updateProject = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: ProjectUpdate }) => {
            const response = await api.put<Project>(`/projects/${id}`, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
        },
    });

    const deleteProject = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/projects/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
        },
    });

    return {
        projects: projectsQuery.data ?? [],
        isLoading: projectsQuery.isLoading,
        isError: projectsQuery.isError,
        error: projectsQuery.error,
        createProject,
        updateProject,
        deleteProject,
    };
}

export function useProject(id: string) {
    // const queryClient = useQueryClient(); // Removed unused
    const PROJECT_QUERY_KEY = ['projects', id];

    const projectQuery = useQuery({
        queryKey: PROJECT_QUERY_KEY,
        queryFn: async () => {
            const response = await api.get<Project>(`/projects/${id}`);
            return response;
        },
        enabled: !!id,
    });

    return {
        project: projectQuery.data,
        isLoading: projectQuery.isLoading,
        isError: projectQuery.isError,
    };
}
