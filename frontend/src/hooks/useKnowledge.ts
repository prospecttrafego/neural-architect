import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Article } from '@/types/knowledge.types';

export function useKnowledge() {
    return useQuery({
        queryKey: ['knowledge'],
        queryFn: async () => {
            const response = await api.get<Article[]>('/knowledge/');
            return response;
        }
    });
}

export function useArticle(id: string) {
    return useQuery({
        queryKey: ['article', id],
        queryFn: async () => {
            const response = await api.get<Article>(`/knowledge/${id}`);
            return response;
        },
        enabled: !!id,
    });
}
