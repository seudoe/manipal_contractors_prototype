"use client";

import { useMemo, useState } from "react";
import { ReactFlow, Background, Controls, MarkerType, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { NODE_WIDTH, NODE_HEIGHT } from "@/lib/graph/layout";
import { EntityNode, type EntityNodeData } from "./entity-node";
import type { CollusionGraphNode, CollusionGraphEdge, CollusionMotifType } from "@/types/collusion";

const nodeTypes = { entity: EntityNode };

const MOTIF_COLOR: Record<CollusionMotifType, string> = {
  SHARED_DIRECTOR: "#dc2626",
  SHARED_ADDRESS: "#d97706",
  SHARED_BANK: "#7c3aed",
  RECENT_INCORPORATION: "#0891b2",
  LOSING_BIDDER_AS_SUB: "#be123c",
};

/**
 * Works out which end of each edge is physically higher/left first (per
 * db/collusion.ts's hand-authored x/y), then picks the matching handle pair
 * on entity-node.tsx — this graph is relational (firms cluster, not rank),
 * so unlike the feature/contractor graphs it isn't laid out by dagre in one
 * fixed direction, and a single fixed handle convention would make edges
 * loop around the sides whenever the relative position flips.
 */
function pickHandles(
  a: { x: number; y: number },
  b: { x: number; y: number }
): { sourceHandle: string; targetHandle: string } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dy) >= Math.abs(dx)) {
    return dy >= 0
      ? { sourceHandle: "bottom-source", targetHandle: "top-target" }
      : { sourceHandle: "top-source", targetHandle: "bottom-target" };
  }
  return dx >= 0
    ? { sourceHandle: "right-source", targetHandle: "left-target" }
    : { sourceHandle: "left-source", targetHandle: "right-target" };
}

export function CollusionGraphFlow({
  nodes,
  edges,
  highlightedFindingId,
  onEdgeClick,
}: {
  nodes: CollusionGraphNode[];
  edges: CollusionGraphEdge[];
  highlightedFindingId?: string | null;
  onEdgeClick?: (findingId: string) => void;
}) {
  const [internalHighlight, setInternalHighlight] = useState<string | null>(null);
  const activeFindingId = highlightedFindingId ?? internalHighlight;

  const { flowNodes, flowEdges } = useMemo(() => {
    const positionById = new Map(nodes.map((n) => [n.entityId, { x: n.x, y: n.y }]));

    const rfNodes: Node[] = nodes.map((n) => ({
      id: n.entityId,
      type: "entity",
      position: { x: n.x, y: n.y },
      style: { width: NODE_WIDTH, height: NODE_HEIGHT },
      draggable: true,
      data: {
        label: n.label,
        gstin: n.gstin,
        incorporationDate: n.incorporationDate,
        highlighted:
          activeFindingId != null &&
          edges.some(
            (e) =>
              e.findingId === activeFindingId &&
              (e.source === n.entityId || e.target === n.entityId)
          ),
      } satisfies EntityNodeData,
    }));

    const rfEdges: Edge[] = edges.map((e) => {
      const a = positionById.get(e.source) ?? { x: 0, y: 0 };
      const b = positionById.get(e.target) ?? { x: 0, y: 0 };
      const { sourceHandle, targetHandle } = pickHandles(a, b);
      const active = e.findingId === activeFindingId;
      const color = MOTIF_COLOR[e.motifType];
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle,
        targetHandle,
        label: e.label,
        type: "smoothstep",
        pathOptions: { borderRadius: 12 },
        style: { stroke: color, strokeWidth: active ? 3 : 1.5 },
        labelStyle: { fill: color, fontSize: 10, fontWeight: 600 },
        markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
      };
    });

    return { flowNodes: rfNodes, flowEdges: rfEdges };
  }, [nodes, edges, activeFindingId]);

  return (
    <div className="h-[55vh] w-full overflow-hidden rounded-xl border border-indigo-200 dark:border-indigo-800/40">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onEdgeClick={(_e, edge) => {
          const finding = edges.find((fe) => fe.id === edge.id);
          if (!finding) return;
          setInternalHighlight(finding.findingId);
          onEdgeClick?.(finding.findingId);
        }}
        onPaneClick={() => setInternalHighlight(null)}
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
