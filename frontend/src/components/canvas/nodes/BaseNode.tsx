import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface BaseNodeProps extends NodeProps {
    className?: string;
    headerColor?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    handles?: { type: 'source' | 'target'; position: Position; id?: string }[];
}

export const BaseNode: React.FC<BaseNodeProps> = ({
    data,
    selected,
    className,
    headerColor = "bg-primary",
    icon,
    children,
    handles = [
        { type: 'target', position: Position.Top },
        { type: 'source', position: Position.Bottom }
    ]
}) => {
    return (
        <Card className={cn(
            "min-w-48 border-white/10 bg-background/60 backdrop-blur-md shadow-xl transition-all duration-300",
            selected ? "ring-2 ring-primary border-primary/50 shadow-primary/20 shadow-2xl scale-105" : "hover:border-white/20",
            className
        )}>
            <div className={cn("h-1 w-full absolute top-0 left-0", headerColor)} />

            {(data.label || icon) && (
                <CardHeader className="p-3 pb-0 flex flex-row items-center gap-2 space-y-0">
                    {icon && (
                        <div className={cn("p-1.5 rounded-md text-white/90 bg-white/10")}>
                            {React.cloneElement(icon as React.ReactElement, { size: 14 })}
                        </div>
                    )}
                    <span className="text-sm font-semibold text-foreground/90 truncate">{data.label as string}</span>
                </CardHeader>
            )}

            <CardContent className="p-3 text-xs text-muted-foreground">
                {children || <div className="italic opacity-50">Configure logic...</div>}
            </CardContent>

            {handles.map((handle, index) => (
                <Handle
                    key={`${handle.type}-${index}`}
                    type={handle.type}
                    position={handle.position}
                    id={handle.id}
                    className={cn(
                        "w-3 h-3 border-2 border-background transition-all",
                        handle.type === 'target' ? "!bg-blue-500 hover:!bg-blue-400" : "!bg-primary hover:!bg-primary/80",
                    )}
                />
            ))}
        </Card>
    );
};
