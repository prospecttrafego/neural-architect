import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useParams } from 'react-router-dom';
import { Canvas } from '@/components/canvas/Canvas';
import { NodePalette } from '@/components/canvas/panels/NodePalette';
import { useProject } from '@/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, Share2, Settings } from 'lucide-react';

import { useCanvasAutoSave } from '@/hooks/useCanvasAutoSave';
import { DocumentsPanel } from '@/components/canvas/documents/DocumentsPanel';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { NodeInspector } from '@/components/canvas/panels/NodeInspector';
import { PartnerChat } from '@/components/canvas/panels/PartnerChat';
import { cn } from '@/lib/utils';

export function SoftwareWorkspacePage() {
    const { projectId } = useParams<{ projectId: string }>();
    const { project, isLoading, isError } = useProject(projectId!);
    const [view, setView] = useState<'canvas' | 'documents'>('canvas');

    // Auto-save integration
    // We need to fetch the canvas ID associated with the project first, or assuming project has canvas_id
    // For now, let's assume project object has a canvas_id or we fetch it.
    // Based on models, Project has 'canvases' relationship.
    // Let's assume we use the first canvas or a specific one.
    // For simplicity validation, passing projectId for now if backend handles it, or finding canvas.
    const canvasId = project?.canvases?.[0]?.id;
    const { isSaving, lastSaved } = useCanvasAutoSave(projectId, canvasId);

    if (isLoading) {
        return (
            <div className="flex h-full w-full bg-background items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !project) {
        return (
            <div className="flex h-full w-full justify-center items-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500">Erro ao carregar projeto</h2>
                    <p className="text-muted-foreground mt-2">Não foi possível encontrar o projeto solicitado.</p>
                    <Link to="/software">
                        <Button variant="outline" className="mt-4">Voltar</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            {/* Toolbar Header */}
            <header className="h-14 border-b border-white/5 bg-background/50 backdrop-blur-xl flex items-center justify-between px-4 shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <Link to="/software">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm font-semibold text-foreground/90">{project.name}</h1>
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 py-0 border-white/10 text-muted-foreground">
                                Software
                            </Badge>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center ml-8 bg-white/5 rounded-lg p-1 border border-white/5">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn("h-8 px-3 rounded-md", view === 'canvas' ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground")}
                            onClick={() => setView('canvas')}
                        >
                            Canvas
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn("h-8 px-3 rounded-md", view === 'documents' ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground")}
                            onClick={() => setView('documents')}
                        >
                            Documents
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground mr-4">
                        {/* Status indicator */}
                        <div className="flex items-center gap-2">
                            {isSaving ? (
                                <span className="flex items-center gap-1.5 text-yellow-500">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                    </span>
                                    Saving...
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-emerald-500">
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Ready'}
                                </span>
                            )}
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]">
                        <Save className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </header>

            {/* Main Workspace Area */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Panel - Palette (Only visible in Canvas view) */}
                {view === 'canvas' && (
                    <div className="z-10 h-full">
                        <NodePalette />
                    </div>
                )}

                {/* Center - Canvas or Documents */}
                <div className="flex-1 h-full relative bg-background/95">
                    {view === 'canvas' ? (
                        <div className="absolute inset-0">
                            <Canvas />
                        </div>
                    ) : (
                        <DocumentsPanel projectId={projectId!} />
                    )}
                </div>

                {/* Right Panel - Inspector/Chat */}
                <div className="w-80 border-l border-white/5 bg-background/50 backdrop-blur-xl z-10 shrink-0 flex flex-col">
                    <Tabs defaultValue="properties" className="flex-1 flex flex-col">
                        <div className="p-2 border-b border-white/5">
                            <TabsList className="w-full grid grid-cols-2 bg-white/5">
                                <TabsTrigger value="properties">Properties</TabsTrigger>
                                <TabsTrigger value="partner">Partner AI</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="properties" className="flex-1 mt-0 h-full overflow-hidden data-[state=inactive]:hidden">
                            <NodeInspector />
                        </TabsContent>

                        <TabsContent value="partner" className="flex-1 mt-0 h-full overflow-hidden data-[state=inactive]:hidden">
                            <PartnerChat projectId={project!.id} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
