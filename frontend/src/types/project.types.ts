export const ProjectCategory = {
    SOFTWARE: 'software',
    AGENTS: 'agents',
    AUTOMATION: 'automation',
} as const;

export type ProjectCategory = typeof ProjectCategory[keyof typeof ProjectCategory];

export const ProjectStatus = {
    DRAFT: 'draft',
    IN_PROGRESS: 'in_progress',
    REVIEW: 'review',
    COMPLETED: 'completed',
    ARCHIVED: 'archived',
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export interface ProjectSettings {
    [key: string]: unknown;
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    category: ProjectCategory;
    status: ProjectStatus;
    user_id: string;
    created_at: string;
    updated_at?: string;
    settings?: ProjectSettings;
    progress?: number;
    thumbnail_url?: string;
    canvases?: { id: string }[];
}

export interface ProjectCreate {
    name: string;
    category: ProjectCategory;
    description?: string;
    settings?: ProjectSettings;
}

export interface ProjectUpdate {
    name?: string;
    description?: string;
    category?: ProjectCategory;
    status?: ProjectStatus;
    settings?: ProjectSettings;
    progress?: number;
}
