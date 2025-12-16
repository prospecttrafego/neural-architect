import type { Message } from '@/types/chat.types';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
    message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
    const isUser = message.role === 'user';

    return (
        <div className={cn("flex gap-3 text-sm mb-4", isUser ? "flex-row-reverse" : "flex-row")}>
            <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10",
                isUser ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
            )}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={cn(
                "flex-1 px-4 py-2 rounded-lg leading-relaxed",
                isUser
                    ? "bg-primary/10 text-primary-foreground border border-primary/20 ml-12"
                    : "bg-white/5 text-foreground border border-white/10 mr-12"
            )}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.isStreaming && (
                    <span className="inline-block w-1.5 h-3 ml-1 bg-current animate-pulse" />
                )}
            </div>
        </div>
    );
};
