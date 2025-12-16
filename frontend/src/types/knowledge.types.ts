export type KnowledgeCategory = 'methodology' | 'pattern' | 'template' | 'checklist';

export interface Article {
    id: string;
    title: string;
    slug: string;
    category: KnowledgeCategory;
    subcategory?: string;
    content: string;
    tags?: string; // Backend sends string, maybe parse to array in UI
    vertical?: string;
    created_at: string;
    updated_at: string;
}

// Helper type for frontend grouping
export interface CategoryGroup {
    id: string;
    title: string;
    articles: Article[];
}
