import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Project, ProjectCategory } from '@/schemas';

interface ProjectState {
    // Current project
    currentProject: Project | null;
    setCurrentProject: (project: Project | null) => void;

    // Projects list
    projects: Project[];
    setProjects: (projects: Project[]) => void;
    addProject: (project: Project) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    removeProject: (id: string) => void;

    // Filters
    filterCategory: ProjectCategory | null;
    filterStatus: string | null;
    searchQuery: string;
    setFilterCategory: (category: ProjectCategory | null) => void;
    setFilterStatus: (status: string | null) => void;
    setSearchQuery: (query: string) => void;
    clearFilters: () => void;
}

/**
 * Project store for managing projects state
 */
export const useProjectStore = create<ProjectState>()(
    devtools(
        (set) => ({
            // Current project
            currentProject: null,
            setCurrentProject: (project) => set({ currentProject: project }),

            // Projects list
            projects: [],
            setProjects: (projects) => set({ projects }),
            addProject: (project) =>
                set((state) => ({ projects: [project, ...state.projects] })),
            updateProject: (id, updates) =>
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === id ? { ...p, ...updates } : p
                    ),
                    currentProject:
                        state.currentProject?.id === id
                            ? { ...state.currentProject, ...updates }
                            : state.currentProject,
                })),
            removeProject: (id) =>
                set((state) => ({
                    projects: state.projects.filter((p) => p.id !== id),
                    currentProject:
                        state.currentProject?.id === id ? null : state.currentProject,
                })),

            // Filters
            filterCategory: null,
            filterStatus: null,
            searchQuery: '',
            setFilterCategory: (category) => set({ filterCategory: category }),
            setFilterStatus: (status) => set({ filterStatus: status }),
            setSearchQuery: (query) => set({ searchQuery: query }),
            clearFilters: () =>
                set({ filterCategory: null, filterStatus: null, searchQuery: '' }),
        }),
        { name: 'project-store' }
    )
);
