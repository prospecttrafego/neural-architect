import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
import {
    PlayCircle,
    StopCircle,
    Activity,
    GitBranch,
    Database,
    Globe,
    MessageSquare,
    Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaletteItemProps {
    type: string;
    label: string;
    icon: React.ReactNode;
    color: string;
}

const PaletteItem = ({ type, label, icon, color }: PaletteItemProps) => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-white/5 bg-white/5 cursor-grab hover:bg-white/10 active:cursor-grabbing transition-all hover:border-white/20 group",
                "h-24 w-full"
            )}
            onDragStart={(event) => onDragStart(event, type)}
            draggable
        >
            <div className={cn("p-2 rounded-full bg-opacity-20 transition-all group-hover:bg-opacity-30", color)}>
                {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5", strokeWidth: 1.5, ...({} as any) })}
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
        </div>
    );
};

export function NodePalette() {
    return (
        <Card className="h-full border-none rounded-none bg-background/50 backdrop-blur-xl border-r border-white/5 w-64 flex flex-col">
            <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-foreground/80">Componentes</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-2">

                <div className="space-y-6">
                    <div>
                        <h4 className="text-xs uppercase tracking-wider text-muted-foreground/60 font-semibold mb-3 pl-1">Flow Control</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <PaletteItem type="start" label="Start" icon={<PlayCircle />} color="bg-emerald-500/20 text-emerald-500" />
                            <PaletteItem type="end" label="End" icon={<StopCircle />} color="bg-rose-500/20 text-rose-500" />
                            <PaletteItem type="process" label="Process" icon={<Activity />} color="bg-blue-500/20 text-blue-500" />
                            <PaletteItem type="decision" label="Decision" icon={<GitBranch />} color="bg-amber-500/20 text-amber-500" />
                        </div>
                    </div>

                    <div className="h-px bg-white/5 my-4" />

                    <div>
                        <h4 className="text-xs uppercase tracking-wider text-muted-foreground/60 font-semibold mb-3 pl-1">Services</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <PaletteItem type="database" label="Database" icon={<Database />} color="bg-purple-500/20 text-purple-500" />
                            <PaletteItem type="api" label="API" icon={<Globe />} color="bg-cyan-500/20 text-cyan-500" />
                        </div>
                    </div>

                    <div className="h-px bg-white/5 my-4" />

                    <div>
                        <h4 className="text-xs uppercase tracking-wider text-muted-foreground/60 font-semibold mb-3 pl-1">AI & Chat</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <PaletteItem type="agent" label="AI Agent" icon={<Brain />} color="bg-fuchsia-500/20 text-fuchsia-500" />
                            <PaletteItem type="message" label="Message" icon={<MessageSquare />} color="bg-indigo-500/20 text-indigo-500" />
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
