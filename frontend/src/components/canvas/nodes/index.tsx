
import { BaseNode } from './BaseNode';
import type { NodeProps } from '@xyflow/react';
import { Position } from '@xyflow/react';
import { PlayCircle, StopCircle, Activity, GitBranch } from 'lucide-react';

export const StartNode = (props: NodeProps) => (
    <BaseNode
        {...props}
        headerColor="bg-emerald-500"
        icon={<PlayCircle />}
        handles={[{ type: 'source', position: Position.Bottom }]}
    >
        <div className="text-emerald-500/80">Entry Point</div>
    </BaseNode>
);

export const EndNode = (props: NodeProps) => (
    <BaseNode
        {...props}
        headerColor="bg-rose-500"
        icon={<StopCircle />}
        handles={[{ type: 'target', position: Position.Top }]}
    >
        <div className="text-rose-500/80">Exit Point</div>
    </BaseNode>
);

export const ProcessNode = (props: NodeProps) => (
    <BaseNode
        {...props}
        headerColor="bg-blue-500"
        icon={<Activity />}
    >
        Execute logic block
    </BaseNode>
);

export const DecisionNode = (props: NodeProps) => (
    <BaseNode
        {...props}
        headerColor="bg-amber-500"
        icon={<GitBranch />}
        handles={[
            { type: 'target', position: Position.Top },
            { type: 'source', position: Position.Bottom, id: 'true' },
            { type: 'source', position: Position.Right, id: 'false' },
        ]}
    >
        <div className="flex justify-between w-full px-2">
            <span className="text-emerald-500">True</span>
            <span className="text-rose-500">False</span>
        </div>
    </BaseNode>
);
