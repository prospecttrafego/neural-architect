// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

// Project Categories
export const PROJECT_CATEGORIES = {
    software: {
        label: 'Software / SaaS',
        description: 'Web apps, APIs, dashboards',
        color: 'indigo',
    },
    agents: {
        label: 'Multi-Agents IA',
        description: 'Sistemas de agentes inteligentes',
        color: 'violet',
    },
    automation: {
        label: 'Automação',
        description: 'SDR, Closer, Suporte',
        color: 'emerald',
    },
} as const;

// Project Statuses
export const PROJECT_STATUSES = {
    draft: { label: 'Rascunho', color: 'gray' },
    in_progress: { label: 'Em Progresso', color: 'blue' },
    review: { label: 'Revisão', color: 'amber' },
    completed: { label: 'Concluído', color: 'green' },
    archived: { label: 'Arquivado', color: 'gray' },
} as const;

// Document Types
export const DOCUMENT_TYPES = {
    TIS: 'Technical Implementation Spec',
    PRD: 'Product Requirements Document',
    BLUEPRINT: 'Technical Blueprint',
    AGENT_SPEC: 'Agent Specification',
    FLOW_SPEC: 'Flow Specification',
    SYSTEM_PROMPT: 'System Prompt',
} as const;

// Canvas Node Types by Category
export const NODE_TYPES = {
    software: [
        'start', 'end', 'process', 'decision', 'database',
        'api', 'user_interface', 'service', 'queue', 'cache',
    ],
    agents: [
        'start', 'end', 'agent', 'tool', 'knowledge',
        'memory', 'human_loop', 'decision', 'parallel',
    ],
    automation: [
        'start', 'end', 'message', 'wait_response', 'condition',
        'action', 'integration', 'human_handoff', 'schedule',
    ],
} as const;

// Auto-save interval (ms)
export const AUTO_SAVE_INTERVAL = 5000;

// Max history states for undo/redo
export const MAX_HISTORY_STATES = 50;
