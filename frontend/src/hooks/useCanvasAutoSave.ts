import { useEffect, useRef, useState } from 'react';
import { useCanvasStore } from '@/stores/useCanvasStore';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { CanvasState } from '@/types/canvas.types';
import { useShallow } from 'zustand/react/shallow';

const AUTO_SAVE_DELAY = 2000; // 2 seconds

export function useCanvasAutoSave(projectId: string | undefined, canvasId: string | undefined) {
    const { nodes, edges } = useCanvasStore(
        useShallow((state) => ({
            nodes: state.nodes,
            edges: state.edges,
        }))
    );
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Ref to track if internal changes are happening vs initial load
    const isFirstRender = useRef(true);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const saveCanvas = useMutation({
        mutationFn: async (data: Partial<CanvasState>) => {
            if (!projectId || !canvasId) return;
            // Assuming endpoint structure. Adjust as needed if we save via project or direct canvas ID
            // Here assuming we patch the canvas directly
            await api.patch(`/canvases/${canvasId}`, {
                nodes_data: data.nodes,
                edges_data: data.edges
            });
        },
        onSuccess: () => {
            setIsSaving(false);
            setLastSaved(new Date());
        },
        onError: () => {
            setIsSaving(false);
            toast.error("Erro ao salvar canvas automaticamente");
        }
    });

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (!projectId || !canvasId) return;

        // setIsSaving(true) moved to timer logic below to avoid strict mode/effect warnings

        // Debounce save
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        } else {
            // Only set saving status if we are starting a new save timer
            // Wrap in timeout to avoid sync update in effect warning
            setTimeout(() => setIsSaving(true), 0);
        }

        timeoutRef.current = setTimeout(() => {
            saveCanvas.mutate({ nodes, edges });
        }, AUTO_SAVE_DELAY);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [nodes, edges, projectId, canvasId, saveCanvas]);

    return {
        isSaving,
        lastSaved
    };
}
