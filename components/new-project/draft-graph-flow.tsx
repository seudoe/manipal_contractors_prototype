"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { layoutWithDagre, NODE_WIDTH, NODE_HEIGHT } from "@/lib/graph/layout";
import { flattenTree, countDescendants, type DraftNode } from "@/lib/new-project/types";
import { DraftFeatureNode, type DraftFeatureNodeData } from "@/components/graph/draft-feature-node";

const nodeTypes = { draftFeature: DraftFeatureNode };

export function DraftGraphFlow({
  root,
  selectedId,
  onSelect,
  onAddChild,
}: {
  root: DraftNode;
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
  onAddChild: (nodeId: string) => void;
}) {
  // Local to this component, but since DraftGraphFlow stays mounted the whole
  // time (see new-project-editor.tsx's CSS-only tab toggle), this survives
  // switching to the List tab and back — no need to lift it any higher.
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  const handleToggleCollapse = useCallback((nodeId: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  const { flowNodes, flowEdges } = useMemo(() => {
    const { nodes, edges } = flattenTree(root, collapsedIds);
    // authoring tree: parent above child, normal top-down flow
    const positions = layoutWithDagre(
      nodes.map((n) => n.id),
      edges.map((e) => ({ source: e.parentId, target: e.childId })),
      "TB"
    );

    const rfNodes: Node[] = nodes.map((n) => {
      const collapsed = collapsedIds.has(n.id);
      return {
        id: n.id,
        type: "draftFeature",
        position: positions.get(n.id) ?? { x: 0, y: 0 },
        style: { width: NODE_WIDTH, height: NODE_HEIGHT },
        selected: n.id === selectedId,
        draggable: true,
        data: {
          label: n.name || "(unnamed)",
          nodeType: n.nodeType,
          hasChildren: n.children.length > 0,
          collapsed,
          descendantCount: collapsed ? countDescendants(n) : 0,
          onAddChild,
          onToggleCollapse: handleToggleCollapse,
        } satisfies DraftFeatureNodeData,
      };
    });

    const rfEdges: Edge[] = edges.map((e) => ({
      id: `${e.parentId}-${e.childId}`,
      source: e.parentId,
      target: e.childId,
      sourceHandle: "b",
      targetHandle: "t",
      type: "smoothstep",
      pathOptions: { borderRadius: 12 },
      style: { stroke: "#a5b4fc", strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#a5b4fc", width: 16, height: 16 },
    }));

    return { flowNodes: rfNodes, flowEdges: rfEdges };
  }, [root, selectedId, onAddChild, collapsedIds, handleToggleCollapse]);

  const handleNodeClick: NodeMouseHandler = (_event, node) => onSelect(node.id);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
        nodesConnectable={false}
        elementsSelectable
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
