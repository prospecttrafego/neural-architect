import { useState } from 'react';
import { useCanvasStore } from '@/stores/useCanvasStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Trash2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import type { Node } from '@xyflow/react';

const NodePropertiesForm = ({ node }: { node: Node }) => {
    const { onNodesChange } = useCanvasStore();
    const [label, setLabel] = useState((node.data.label as string) || '');
    const [description, setDescription] = useState((node.data.description as string) || '');

    const handleSave = () => {
        onNodesChange([
            {
                id: node.id,
                type: 'replace',
                item: {
                    ...node,
                    data: {
                        ...node.data,
                        label,
                        description,
                    },
                },
            },
        ]);
    };

    const handleDelete = () => {
        onNodesChange([{ id: node.id, type: 'remove' }]);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">ID</Label>
                <div className="text-xs font-mono bg-white/5 p-2 rounded">{node.id}</div>
            </div>

            <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Type</Label>
                <div className="text-xs font-mono capitalize">{node.type}</div>
            </div>

            <hr className="border-white/10" />

            <div className="space-y-2">
                <Label htmlFor="node-label">Label</Label>
                <Input
                    id="node-label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Node name"
                    className="bg-white/5 border-white/10 focus:border-primary/50"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="node-desc">Description</Label>
                <Textarea
                    id="node-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What does this step do?"
                    className="bg-white/5 border-white/10 focus:border-primary/50 min-h-[100px]"
                />
            </div>

            <div className="pt-4 flex flex-col gap-2">
                <Button onClick={handleSave} className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20">
                    Apply Changes
                </Button>
                <Button onClick={handleDelete} variant="destructive" className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Node
                </Button>
            </div>
        </div>
    );
};

export const NodeInspector = () => {
    const { nodes } = useCanvasStore(
        useShallow((state) => ({
            nodes: state.nodes,
        }))
    );

    const selectedNode = nodes.find((n: Node) => n.selected);

    if (!selectedNode) {
        return (
            <div className="h-full border-l border-white/5 bg-background/50 backdrop-blur-xl p-4 flex items-center justify-center text-muted-foreground text-sm">
                Select a node to edit
            </div>
        );
    }

    return (
        <Card className="h-full border-l border-white/5 border-t-0 border-b-0 border-r-0 rounded-none bg-background/50 backdrop-blur-xl flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b border-white/5">
                <CardTitle className="text-sm font-medium">Node Properties</CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { }}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 p-4">
                {/* Re-mount form when selection changes by using key */}
                <NodePropertiesForm key={selectedNode.id} node={selectedNode} />
            </CardContent>
        </Card>
    );
};
