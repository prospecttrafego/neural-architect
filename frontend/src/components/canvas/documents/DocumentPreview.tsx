import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Document } from '@/types/document.types';

interface DocumentPreviewProps {
    document: Document;
}

export const DocumentPreview = ({ document }: DocumentPreviewProps) => {
    return (
        <ScrollArea className="h-full w-full p-8 bg-background">
            <div className="max-w-4xl mx-auto prose prose-invert prose-blue">
                <h1 className="text-3xl font-bold mb-4">{document.title}</h1>
                <div className="text-sm text-muted-foreground mb-8">
                    Version: {document.version} | Generated: {new Date(document.created_at).toLocaleDateString()}
                </div>
                <ReactMarkdown>{document.content}</ReactMarkdown>
            </div>
        </ScrollArea>
    );
};
