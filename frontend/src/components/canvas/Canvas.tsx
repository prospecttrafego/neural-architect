import React, { useCallback } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    MiniMap,
    ReactFlowProvider,
    Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCanvasStore } from '@/stores/useCanvasStore';
import { useShallow } from 'zustand/react/shallow';
import { StartNode, ProcessNode, DecisionNode, EndNode } from './nodes';

const nodeTypes = {
    start: StartNode,
    process: ProcessNode,
    decision: DecisionNode,
    end: EndNode,
};

const selector = (state: any) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
});

function CanvasComponent() {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useCanvasStore(
        useShallow(selector)
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            // Get position - would need project implementation for accurate positioning relative to canvas
            // const position = reactFlowInstance.screenToFlowPosition({
            //   x: event.clientX,
            //   y: event.clientY,
            // });
            const position = { x: event.clientX - 200, y: event.clientY - 100 }; // Rough estimate

            const newNode = {
                id: `${type}-${Date.now()}`,
                type,
                position,
                data: { label: `${type} node` },
            };

            // useCanvasStore.getState().addNode(newNode);
            // using the store hook would be better if we had access here, 
            // but we are inside the component so we can use the store action.
            useCanvasStore.getState().addNode(newNode);
        },
        []
    );

    return (
        <div className="w-full h-full bg-background/50 backdrop-blur-3xl rounded-xl border border-white/5 overflow-hidden shadow-2xl">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onDragOver={onDragOver}
                onDrop={onDrop}
                fitView
                className="bg-grid-white/[0.02]"
            >
                <Background color="rgba(255, 255, 255, 0.05)" gap={20} size={1} />
                <Controls className="bg-background/80 backdrop-blur-md border border-white/10 fill-foreground" />
                <MiniMap
                    className="bg-background/80 backdrop-blur-md border border-white/10"
                    nodeColor="rgba(255,255,255,0.2)"
                    maskColor="rgba(0,0,0,0.4)"
                />

                <Panel position="top-right" className="bg-background/80 backdrop-blur-md p-2 rounded-lg border border-white/10">
                    <div className="text-xs text-muted-foreground">Neural Canvas v1.0</div>
                </Panel>
            </ReactFlow>
        </div>
    );
}

export function Canvas() {
    return (
        <ReactFlowProvider>
            <CanvasComponent />
        </ReactFlowProvider>
    );
}
