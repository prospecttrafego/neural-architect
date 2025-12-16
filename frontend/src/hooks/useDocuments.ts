import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Document, DocumentType, DocumentGenerateRequest } from '@/types/document.types';
import { toast } from 'sonner';

export function useDocuments(projectId: string) {
    const queryClient = useQueryClient();

    const { data: documents, isLoading } = useQuery({
        queryKey: ['documents', projectId],
        queryFn: async () => {
            const response = await api.get<Document[]>(`/documents/?project_id=${projectId}`);
            return response.data;
        },
        enabled: !!projectId,
    });

    const generateDocument = useMutation({
        mutationFn: async (data: DocumentGenerateRequest) => {
            const response = await api.post<Document>('/documents/generate', data);
            return response.data;
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
