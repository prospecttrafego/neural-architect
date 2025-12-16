import { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { DocumentPreview } from './DocumentPreview';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2, FileText, Plus } from 'lucide-react';
import { DocumentType } from '@/types/document.types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocumentsPanelProps {
    projectId: string;
}

export const DocumentsPanel = ({ projectId }: DocumentsPanelProps) => {
    const { documents, isLoading, generateDocument } = useDocuments(projectId);
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

    const selectedDoc = documents?.find(d => d.id === selectedDocId);

    const handleGenerate = (type: DocumentType) => {
        generateDocument.mutate({ project_id: projectId, type });
    };

    if (selectedDoc) {
        return (
            <div className="flex flex-col h-full">
                <div className="h-14 border-b border-white/5 flex items-center px-4 gap-4 bg-background/50 backdrop-blur-xl shrink-0">
                    <Button variant="ghost" onClick={() => setSelectedDocId(null)}>
                        ← Back to List
                    </Button>
                    <span className="font-semibold">{selectedDoc.title}</span>
                </div>
                <div className="flex-1 overflow-hidden">
                    <DocumentPreview document={selectedDoc} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background/95">
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-8 bg-background/50 backdrop-blur-xl shrink-0">
                <h2 className="text-lg font-semibold">Project Documents</h2>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        onClick={() => handleGenerate(DocumentType.TIS)}
                        disabled={generateDocument.isPending}
                    >
                        {generateDocument.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        Generate TIS
                    </Button>
                    {/* Add PRD button later */}
                </div>
            </div>

            <ScrollArea className="flex-1 p-8">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                        <div className="col-span-full flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : documents?.length === 0 ? (
                        <div className="col-span-full text-center p-12 border border-dashed border-white/10 rounded-lg text-muted-foreground">
                            No documents generated yet. Create one!
                        </div>
                    ) : (
                        documents?.map((doc) => (
                            <Card
                                key={doc.id}
                                className="cursor-pointer hover:bg-white/5 transition-colors border-white/10"
                                onClick={() => setSelectedDocId(doc.id)}
                            >
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-2 rounded bg-primary/10 text-primary">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <span className="text-xs font-mono bg-white/5 px-2 py-0.5 rounded text-muted-foreground">
                                            {doc.type}
                                        </span>
                                    </div>
                                    <CardTitle className="text-base">{doc.title}</CardTitle>
                                    <CardDescription>
                                        Date: {new Date(doc.created_at).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};
