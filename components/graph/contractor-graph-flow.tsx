"use client";

import { useMemo } from "react";
import { ReactFlow, Background, Controls, MarkerType, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { layoutWithDagre, NODE_WIDTH, NODE_HEIGHT } from "@/lib/graph/layout";
import { ContractorNode, type ContractorNodeData } from "./contractor-node";
import type { ContractorTreeNode, ContractorTreeEdge } from "@/db/queries";

const nodeTypes = { contractor: ContractorNode };

/**
 * "Who hired whom" — main contractor at top, each subcontractor below the
 * contractor that brought them on, with the features they're responsible
 * for shown right on the node.
 */
export function ContractorGraphFlow({
  nodes,
  edges,
}: {
  nodes: ContractorTreeNode[];
  edges: ContractorTreeEdge[];
}) {
  const { flowNodes, flowEdges } = useMemo(() => {
    // The main contractor is the source everything else descends from, so
    // it should end up on top — "TB" ranks sources highest (rank 0, at top).
    const positions = layoutWithDagre(
      nodes.map((n) => n.contractor.id),
      edges.map((e) => ({ source: e.parentId, target: e.childId })),
      "TB"
    );

    const rfNodes: Node[] = nodes.map((n) => ({
      id: n.contractor.id,
      type: "contractor",
      position: positions.get(n.contractor.id) ?? { x: 0, y: 0 },
      style: { width: NODE_WIDTH, height: NODE_HEIGHT },
      draggable: true,
      data: {
        name: n.contractor.name,
        role: n.depth === 0 ? "MAIN_CONTRACTOR" : "SUBCONTRACTOR",
        features: n.features,
      } satisfies ContractorNodeData,
    }));

    const rfEdges: Edge[] = edges.map((e) => ({
      id: `${e.parentId}-${e.childId}`,
      source: e.parentId,
      target: e.childId,
      sourceHandle: "b",
      targetHandle: "t",
      type: "smoothstep",
      pathOptions: { borderRadius: 12 },
      style: { stroke: "#a1a1aa", strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#a1a1aa", width: 16, height: 16 },
    }));

    return { flowNodes: rfNodes, flowEdges: rfEdges };
  }, [nodes, edges]);

  return (
    <div className="h-[50vh] w-full overflow-hidden rounded-xl border border-indigo-200 dark:border-indigo-800/40">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
