import { z } from 'zod';

// Position Schema
export const PositionSchema = z.object({
    x: z.number(),
    y: z.number(),
});

// Node Data Schema
export const NodeDataSchema = z.object({
    label: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    config: z.record(z.string(), z.unknown()).optional(),
    educationalContent: z.object({
        title: z.string(),
        summary: z.string(),
        learnMoreUrl: z.string().url().optional(),
    }).optional(),
});

// Flow Node Schema
export const FlowNodeSchema = z.object({
    id: z.string(),
    type: z.string(),
    position: PositionSchema,
    data: NodeDataSchema,
    width: z.number().optional(),
    height: z.number().optional(),
    selected: z.boolean().optional(),
    dragging: z.boolean().optional(),
});

// Flow Edge Schema
export const FlowEdgeSchema = z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    sourceHandle: z.string().optional().nullable(),
    targetHandle: z.string().optional().nullable(),
    label: z.string().max(100).optional(),
    type: z.enum(['default', 'smoothstep', 'step', 'straight']).default('smoothstep'),
    animated: z.boolean().default(false),
    style: z.record(z.string(), z.unknown()).optional(),
});

// Viewport Schema
export const ViewportSchema = z.object({
    x: z.number(),
    y: z.number(),
    zoom: z.number().min(0.1).max(4),
});

// Canvas Schema
export const CanvasSchema = z.object({
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    name: z.string().min(1).max(200).default('Main Canvas'),
    nodes: z.array(FlowNodeSchema),
    edges: z.array(FlowEdgeSchema),
    viewport: ViewportSchema.default({ x: 0, y: 0, zoom: 1 }),
    isMain: z.boolean().default(false),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

// Save Canvas Schema (input)
export const SaveCanvasSchema = z.object({
    nodes: z.array(FlowNodeSchema),
    edges: z.array(FlowEdgeSchema),
    viewport: ViewportSchema.optional(),
});

// Types
export type FlowNode = z.infer<typeof FlowNodeSchema>;
export type FlowEdge = z.infer<typeof FlowEdgeSchema>;
export type Canvas = z.infer<typeof CanvasSchema>;
export type SaveCanvas = z.infer<typeof SaveCanvasSchema>;
export type Viewport = z.infer<typeof ViewportSchema>;
export type Position = z.infer<typeof PositionSchema>;
export type NodeData = z.infer<typeof NodeDataSchema>;
