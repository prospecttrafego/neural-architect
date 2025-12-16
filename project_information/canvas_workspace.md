## 9. FEATURE 2: CANVAS WORKSPACE

### 9.1 Canvas API Endpoints

```python
# backend/app/api/v1/endpoints/canvases.py
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.api.v1.schemas.canvas import (
    CanvasCreate, CanvasSave, CanvasResponse
)
from app.services.canvas_service import CanvasService

router = APIRouter(prefix="/canvases", tags=["canvases"])


@router.get("/project/{project_id}", response_model=list[CanvasResponse])
async def list_canvases(
    project_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """List all canvases for a project."""
    service = CanvasService(db)
    return await service.list_canvases(project_id)


@router.get("/project/{project_id}/main", response_model=CanvasResponse)
async def get_main_canvas(
    project_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get the main canvas for a project."""
    service = CanvasService(db)
    canvas = await service.get_main_canvas(project_id)
    if not canvas:
        raise HTTPException(status_code=404, detail="Canvas not found")
    return canvas


@router.get("/{canvas_id}", response_model=CanvasResponse)
async def get_canvas(
    canvas_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a canvas by ID."""
    service = CanvasService(db)
    canvas = await service.get_canvas(canvas_id)
    if not canvas:
        raise HTTPException(status_code=404, detail="Canvas not found")
    return canvas


@router.put("/{canvas_id}", response_model=CanvasResponse)
async def save_canvas(
    canvas_id: UUID,
    data: CanvasSave,
    db: AsyncSession = Depends(get_db)
):
    """Save canvas state (nodes, edges, viewport)."""
    service = CanvasService(db)
    canvas = await service.save_canvas(canvas_id, data)
    if not canvas:
        raise HTTPException(status_code=404, detail="Canvas not found")
    return canvas


@router.post("/project/{project_id}", response_model=CanvasResponse, status_code=status.HTTP_201_CREATED)
async def create_canvas(
    project_id: UUID,
    data: CanvasCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new canvas for a project."""
    service = CanvasService(db)
    return await service.create_canvas(project_id, data)
```

### 9.2 Canvas Store (Zustand)

```typescript
// frontend/src/stores/useCanvasStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import type { Viewport, FlowNode, FlowEdge } from '@/schemas';

interface CanvasState {
  // State
  canvasId: string | null;
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  isDirty: boolean;
  lastSaved: Date | null;
  
  // History for undo/redo
  history: { nodes: Node[]; edges: Edge[] }[];
  historyIndex: number;
  
  // Actions
  setCanvasId: (id: string | null) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setViewport: (viewport: Viewport) => void;
  
  // React Flow handlers
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  // Node operations
  addNode: (node: Node) => void;
  updateNode: (nodeId: string, data: Partial<Node['data']>) => void;
  deleteNode: (nodeId: string) => void;
  
  // History operations
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveToHistory: () => void;
  
  // Sync
  markClean: () => void;
  loadCanvas: (nodes: FlowNode[], edges: FlowEdge[], viewport: Viewport) => void;
  reset: () => void;
}

const MAX_HISTORY = 50;

export const useCanvasStore = create<CanvasState>()(
  devtools(
    (set, get) => ({
      // Initial state
      canvasId: null,
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      isDirty: false,
      lastSaved: null,
      history: [],
      historyIndex: -1,

      // Setters
      setCanvasId: (id) => set({ canvasId: id }),
      
      setNodes: (nodes) => {
        get().saveToHistory();
        set({ nodes, isDirty: true });
      },
      
      setEdges: (edges) => {
        get().saveToHistory();
        set({ edges, isDirty: true });
      },
      
      setViewport: (viewport) => set({ viewport }),

      // React Flow handlers
      onNodesChange: (changes: NodeChange[]) => {
        const hasStructuralChange = changes.some(
          (c) => c.type === 'add' || c.type === 'remove'
        );
        if (hasStructuralChange) {
          get().saveToHistory();
        }
        
        set({
          nodes: applyNodeChanges(changes, get().nodes),
          isDirty: true,
        });
      },

      onEdgesChange: (changes: EdgeChange[]) => {
        const hasStructuralChange = changes.some(
          (c) => c.type === 'add' || c.type === 'remove'
        );
        if (hasStructuralChange) {
          get().saveToHistory();
        }
        
        set({
          edges: applyEdgeChanges(changes, get().edges),
          isDirty: true,
        });
      },

      onConnect: (connection: Connection) => {
        get().saveToHistory();
        set({
          edges: addEdge(
            {
              ...connection,
              type: 'smoothstep',
              animated: false,
            },
            get().edges
          ),
          isDirty: true,
        });
      },

      // Node operations
      addNode: (node) => {
        get().saveToHistory();
        set({
          nodes: [...get().nodes, node],
          isDirty: true,
        });
      },

      updateNode: (nodeId, data) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, ...data } }
              : node
          ),
          isDirty: true,
        });
      },

      deleteNode: (nodeId) => {
        get().saveToHistory();
        set({
          nodes: get().nodes.filter((n) => n.id !== nodeId),
          edges: get().edges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId
          ),
          isDirty: true,
        });
      },

      // History
      saveToHistory: () => {
        const { nodes, edges, history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ nodes: [...nodes], edges: [...edges] });
        
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }
        
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const prevState = history[historyIndex - 1];
          set({
            nodes: prevState.nodes,
            edges: prevState.edges,
            historyIndex: historyIndex - 1,
            isDirty: true,
          });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const nextState = history[historyIndex + 1];
          set({
            nodes: nextState.nodes,
            edges: nextState.edges,
            historyIndex: historyIndex + 1,
            isDirty: true,
          });
        }
      },

      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,

      // Sync
      markClean: () => set({ isDirty: false, lastSaved: new Date() }),

      loadCanvas: (nodes, edges, viewport) => {
        const formattedNodes: Node[] = nodes.map((n) => ({
          id: n.id,
          type: n.type,
          position: n.position,
          data: n.data,
          width: n.width,
          height: n.height,
        }));

        const formattedEdges: Edge[] = edges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle,
          targetHandle: e.targetHandle,
          label: e.label,
          type: e.type,
          animated: e.animated,
        }));

        set({
          nodes: formattedNodes,
          edges: formattedEdges,
          viewport,
          isDirty: false,
          history: [{ nodes: formattedNodes, edges: formattedEdges }],
          historyIndex: 0,
        });
      },

      reset: () =>
        set({
          canvasId: null,
          nodes: [],
          edges: [],
          viewport: { x: 0, y: 0, zoom: 1 },
          isDirty: false,
          lastSaved: null,
          history: [],
          historyIndex: -1,
        }),
    }),
    { name: 'canvas-store' }
  )
);
```

### 9.3 Canvas Component

```tsx
// frontend/src/components/canvas/Canvas.tsx
import { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCanvasStore } from '@/stores/useCanvasStore';
import { useAutoSave } from '@/hooks/useAutoSave';
import { nodeTypes } from './nodes';
import { edgeTypes } from './edges';
import { CanvasControls } from './CanvasControls';
import { NodePalette } from './panels/NodePalette';
import { NodeInspector } from './panels/NodeInspector';

interface CanvasProps {
  canvasId: string;
  projectCategory: 'software' | 'agents' | 'automation';
}

function CanvasInner({ canvasId, projectCategory }: CanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const {
    nodes,
    edges,
    viewport,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setViewport,
  } = useCanvasStore();

  // Auto-save every 5 seconds if dirty
  useAutoSave(canvasId, 5000);

  // Handle drop from palette
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `New ${type}`, description: '' },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onViewportChange={setViewport}
        defaultViewport={viewport}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        className="bg-gray-50"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e5e7eb"
        />
        
        <Controls position="bottom-right" />
        
        <MiniMap
          position="bottom-left"
          nodeColor={(node) => {
            switch (node.type) {
              case 'start':
                return '#10b981';
              case 'end':
                return '#ef4444';
              case 'decision':
                return '#f59e0b';
              default:
                return '#6366f1';
            }
          }}
          maskColor="rgb(0, 0, 0, 0.1)"
        />

        {/* Custom Controls Panel */}
        <Panel position="top-right">
          <CanvasControls />
        </Panel>

        {/* Node Palette */}
        <Panel position="top-left">
          <NodePalette category={projectCategory} />
        </Panel>
      </ReactFlow>

      {/* Node Inspector (Side Panel) */}
      <NodeInspector />
    </div>
  );
}

export function Canvas(props: CanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
}
```