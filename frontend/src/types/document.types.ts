export enum DocumentType {
    TIS = "TIS",
    PRD = "PRD",
    ARCHITECTURE = "ARCHITECTURE",
    AGENT_SPEC = "AGENT_SPEC",
    FLOW_SPEC = "FLOW_SPEC",
    OTHER = "OTHER"
}

export interface Document {
    id: string;
    title: string;
    type: DocumentType;
    content: string;
    version: string;
    project_id: string;
    created_at: string;
    updated_at?: string;
}

export interface DocumentGenerateRequest {
    project_id: string;
    type: DocumentType;
}
