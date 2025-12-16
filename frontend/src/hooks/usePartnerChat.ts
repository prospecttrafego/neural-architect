import { useState, useRef, useCallback } from 'react';
import type { Message } from '@/types/chat.types';
import { v4 as uuidv4 } from 'uuid';

export function usePartnerChat(projectId: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || !projectId) return;

        const userMessage: Message = {
            id: uuidv4(),
            role: 'user',
            content,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        const aiMessageId = uuidv4();
        const aiMessage: Message = {
            id: aiMessageId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            isStreaming: true,
        };

        setMessages((prev) => [...prev, aiMessage]);

        try {
            abortControllerRef.current = new AbortController();

            // Using fetch directly for streaming support since axios/custom api client might buffer
            const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/partner/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth token if needed
                },
                body: JSON.stringify({ message: content, project_id: projectId }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                aiContent += chunk;

                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === aiMessageId
                            ? { ...msg, content: aiContent }
                            : msg
                    )
                );
            }

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === aiMessageId
                        ? { ...msg, isStreaming: false }
                        : msg
                )
            );

        } catch (error: any) {
            if (error.name === 'AbortError') return;
            console.error('Chat error:', error);
            // Handle error state (maybe add error message to chat)
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    }, [projectId]);

    const stopGeneration = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsLoading(false);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.isStreaming ? { ...msg, isStreaming: false } : msg
                )
            );
        }
    }, []);

    return {
        messages,
        isLoading,
        sendMessage,
        stopGeneration
    };
}
