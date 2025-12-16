```typescript
import type {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    Viewport,
} from '@xyflow/react';

export type CanvasMode = 'edit' | 'view';

export interface CanvasState {
    nodes: Node[];
    edges: Edge[];
    viewport: Viewport;
    history: {
        past: { nodes: Node[]; edges: Edge[] }[];
        future: { nodes: Node[]; edges: Edge[] }[];
    };
}

export type CanvasAction =
    | { type: 'SET_NODES'; payload: Node[] }
    | { type: 'SET_EDGES'; payload: Edge[] }
    | { type: 'ADD_NODE'; payload: Node }
    | { type: 'UPDATE_NODE'; payload: { id: string; data: any } }
    | { type: 'DELETE_NODES'; payload: string[] }
    | { type: 'ON_NODES_CHANGE'; payload: NodeChange[] }
    | { type: 'ON_EDGES_CHANGE'; payload: EdgeChange[] }
    | { type: 'ON_CONNECT'; payload: Connection }
    | { type: 'UNDO' }
    | { type: 'REDO' }
    | { type: 'RESET' };

export interface CanvasStore extends CanvasState {
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
    addNode: (node: Node) => void;
    updateNodeData: (id: string, data: any) => void;
    setViewport: (viewport: Viewport) => void;
    undo: () => void;
    redo: () => void;
    reset: () => void;
    saveCanvas: () => Promise<void>;
    canUndo: boolean;
    canRedo: boolean;
}
```
