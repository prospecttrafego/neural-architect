import { useRef, useEffect, useState } from 'react';
import { usePartnerChat } from '@/hooks/usePartnerChat';
import { ChatMessage } from './ChatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, StopCircle, RefreshCw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PartnerChatProps {
    projectId: string;
}

export const PartnerChat = ({ projectId }: PartnerChatProps) => {
    const { messages, isLoading, sendMessage, stopGeneration } = usePartnerChat(projectId);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        sendMessage(input);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-background/50 backdrop-blur-xl">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-semibold text-sm">Partner AI</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100">
                    <RefreshCw className="h-3.5 w-3.5" />
                </Button>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground opacity-50">
                        <BotIcon />
                        <p className="text-sm mt-2">How can I help you architect this?</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))
                )}
            </ScrollArea>

            <div className="p-4 border-t border-white/5">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about architecture, nodes..."
                        className="bg-white/5 border-white/10 focus:border-primary/50"
                        disabled={isLoading}
                    />
                    {isLoading ? (
                        <Button onClick={stopGeneration} size="icon" variant="destructive" className="shrink-0">
                            <StopCircle className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSend} size="icon" className="shrink-0">
                            <Send className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

const BotIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8 mb-2"
    >
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
    </svg>
)
