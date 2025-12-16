import { z } from 'zod';

// Enums
export const ProjectCategoryEnum = z.enum(['software', 'agents', 'automation']);
export const ProjectStatusEnum = z.enum(['draft', 'in_progress', 'review', 'completed', 'archived']);

// Base Project Schema
export const ProjectSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
    description: z.string().max(500).optional().nullable(),
    category: ProjectCategoryEnum,
    status: ProjectStatusEnum.default('draft'),
    progress: z.number().min(0).max(100).default(0),
    thumbnailUrl: z.string().url().optional().nullable(),
    settings: z.record(z.string(), z.unknown()).default({}),
    metadata: z.record(z.string(), z.unknown()).default({}),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    lastAccessedAt: z.string().datetime().optional(),
});

// Create Project Schema (input)
export const CreateProjectSchema = z.object({
    name: z.string().min(3).max(100),
    description: z.string().max(500).optional(),
    category: ProjectCategoryEnum,
});

// Update Project Schema (input)
export const UpdateProjectSchema = z.object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().max(500).optional().nullable(),
    status: ProjectStatusEnum.optional(),
    progress: z.number().min(0).max(100).optional(),
    settings: z.record(z.string(), z.unknown()).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
});

// Types
export type Project = z.infer<typeof ProjectSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
export type ProjectCategory = z.infer<typeof ProjectCategoryEnum>;
export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;
