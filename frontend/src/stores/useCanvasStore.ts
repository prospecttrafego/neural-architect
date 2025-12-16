import { create } from 'zustand';
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    type Connection,
    type Edge as FlowEdge,
    type EdgeChange,
    type Node as FlowNode,
    type NodeChange,
    type Viewport,
} from '@xyflow/react';
import type { CanvasStore, CanvasState } from '@/types/canvas.types';

// Helper to keep history limited
const MAX_HISTORY = 50;

export const useCanvasStore = create<CanvasStore>((set, get) => ({
    nodes: [],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 },
    history: {
        past: [],
        future: [],
    },
    canUndo: false,
    canRedo: false,

    setNodes: (nodes: FlowNode[]) => {
        set({ nodes });
    },

    setEdges: (edges: FlowEdge[]) => {
        set({ edges });
    },

    onNodesChange: (changes: NodeChange[]) => {
        set((state: CanvasState) => {
            const newNodes = applyNodeChanges(changes, state.nodes);

            return {
                nodes: newNodes,
            };
        });
    },

    onEdgesChange: (changes: EdgeChange[]) => {
        set((state: CanvasState) => {
            return {
                edges: applyEdgeChanges(changes, state.edges),
            };
        });
    },

    onConnect: (connection: Connection) => {
        set((state: CanvasState) => {
            const newEdges = addEdge(connection, state.edges);
            // Push to history
            const newPast = [
                ...state.history.past,
                { nodes: state.nodes, edges: state.edges },
            ].slice(-MAX_HISTORY);

            return {
                edges: newEdges,
                history: {
                    past: newPast,
                    future: [],
                },
                canUndo: true,
                canRedo: false,
            };
        });
    },

    addNode: (node: FlowNode) => {
        set((state: CanvasState) => {
            const newNodes = [...state.nodes, node];
            const newPast = [
                ...state.history.past,
                { nodes: state.nodes, edges: state.edges },
            ].slice(-MAX_HISTORY);

            return {
                nodes: newNodes,
                history: {
                    past: newPast,
                    future: [],
                },
                canUndo: true,
                canRedo: false,
            };
        });
    },

    updateNodeData: (id: string, data: any) => {
        set((state: CanvasState) => ({
            nodes: state.nodes.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, ...data } } : node
            ),
        }));
    },

    setViewport: (viewport: Viewport) => {
        set({ viewport });
    },

    undo: () => {
        set((state: CanvasState) => {
            const { past, future } = state.history;
            if (past.length === 0) return state;

            const previous = past[past.length - 1];
            const newPast = past.slice(0, past.length - 1);

            return {
                nodes: previous.nodes,
                edges: previous.edges,
                history: {
                    past: newPast,
                    future: [{ nodes: state.nodes, edges: state.edges }, ...future],
                },
                canUndo: newPast.length > 0,
                canRedo: true,
            };
        });
    },

    redo: () => {
        set((state: CanvasState) => {
            const { past, future } = state.history;
            if (future.length === 0) return state;

            const next = future[0];
            const newFuture = future.slice(1);

            return {
                nodes: next.nodes,
                edges: next.edges,
                history: {
                    past: [...past, { nodes: state.nodes, edges: state.edges }],
                    future: newFuture,
                },
                canUndo: true,
                canRedo: newFuture.length > 0,
            };
        });
    },

    reset: () => {
        set({
            nodes: [],
            edges: [],
            history: { past: [], future: [] },
            canUndo: false,
            canRedo: false
        })
    },

    saveCanvas: async () => {
        // Placeholder for API call
        console.log("Saving canvas...", get().nodes, get().edges);
    },
}));
