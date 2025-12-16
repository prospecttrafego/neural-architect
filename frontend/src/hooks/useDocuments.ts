import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Document, DocumentGenerateRequest } from '@/types/document.types';
import { toast } from 'sonner';

export function useDocuments(projectId: string) {
    const queryClient = useQueryClient();

    const { data: documents, isLoading } = useQuery({
        queryKey: ['documents', projectId],
        queryFn: async () => {
            const response = await api.get<Document[]>(`/documents/?project_id=${projectId}`);
            return response;
        },
        enabled: !!projectId,
    });

    const generateDocument = useMutation({
        mutationFn: async (data: DocumentGenerateRequest) => {
            const response = await api.post<Document>('/documents/generate', data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents', projectId] });
            toast.success("Documento gerado com sucesso!");
        },
        onError: () => {
            toast.error("Erro ao gerar documento.");
        }
    });

    return {
        documents,
        isLoading,
        generateDocument
    };
}
