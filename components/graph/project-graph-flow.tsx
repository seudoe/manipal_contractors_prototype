"use client";

import { useMemo, useState } from "react";
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
import { X } from "lucide-react";
import type { GraphNode, GraphEdge } from "@/types/graph";
import { layoutWithDagre, boundingBoxOf, NODE_WIDTH, NODE_HEIGHT } from "@/lib/graph/layout";
import { FeatureNode, type FeatureNodeData } from "./feature-node";
import { GroupNode, type GroupNodeData } from "./group-node";

const nodeTypes = { feature: FeatureNode, group: GroupNode };

export interface EnrichedGraphNode extends GraphNode {
  creatorName?: string;
  assignment?: { contractorName: string; assignmentType: string };
}

export interface SubcontractorGroup {
  contractorId: string;
  contractorName: string;
  nodeIds: string[];
}

export function ProjectGraphFlow({
  nodes,
  edges,
  groups,
}: {
  nodes: EnrichedGraphNode[];
  edges: GraphEdge[];
  groups: SubcontractorGroup[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { flowNodes, flowEdges } = useMemo(() => {
    // The root PROJECT node is the sink everything else feeds into, so it
    // should end up on top — "BT" ranks sinks highest and puts them there.
    const positions = layoutWithDagre(
      nodes.map((n) => n.id),
      edges.map((e) => ({ source: e.sourceNodeId, target: e.targetNodeId })),
      "BT"
    );

    const groupOfNode = new Map<string, string>();
    for (const group of groups) {
      for (const nodeId of group.nodeIds) groupOfNode.set(nodeId, group.contractorId);
    }

    const groupNodes: Node[] = groups.flatMap((group) => {
      const points = group.nodeIds
        .map((id) => positions.get(id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p));
      const box = boundingBoxOf(points);
      if (!box) return [];
      return [
        {
          id: `group-${group.contractorId}`,
          type: "group",
          position: { x: box.x, y: box.y },
          style: { width: box.width, height: box.height },
          data: { label: group.contractorName } satisfies GroupNodeData,
          draggable: true,
          selectable: false,
        },
      ];
    });
    const groupBoxById = new Map(
      groupNodes.map((g) => [g.id, { x: g.position.x, y: g.position.y }])
    );

    const featureNodes: Node[] = nodes.map((node) => {
      const abs = positions.get(node.id) ?? { x: 0, y: 0 };
      const groupId = groupOfNode.get(node.id);
      const groupBox = groupId ? groupBoxById.get(`group-${groupId}`) : undefined;

      return {
        id: node.id,
        type: "feature",
        position: groupBox
          ? { x: abs.x - groupBox.x, y: abs.y - groupBox.y }
          : abs,
        parentId: groupId ? `group-${groupId}` : undefined,
        extent: groupId ? "parent" : undefined,
        style: { width: NODE_WIDTH, height: NODE_HEIGHT },
        data: { label: node.name, status: node.status, nodeType: node.type } satisfies FeatureNodeData,
        draggable: true,
      };
    });

    const rfEdges: Edge[] = edges.map((edge) => ({
      id: edge.id,
      source: edge.sourceNodeId,
      target: edge.targetNodeId,
      // graph flows bottom-to-top — source exits its top, target receives at its bottom
      sourceHandle: "t",
      targetHandle: "b",
      type: "smoothstep",
      pathOptions: { borderRadius: 12 },
      style: { stroke: "#a1a1aa", strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#a1a1aa", width: 16, height: 16 },
    }));

    return { flowNodes: [...groupNodes, ...featureNodes], flowEdges: rfEdges };
  }, [nodes, edges, groups]);

  const selectedNode = selectedId ? nodes.find((n) => n.id === selectedId) : undefined;

  const handleNodeClick: NodeMouseHandler = (_event, node) => {
    if (node.type === "group") return;
    setSelectedId(node.id);
  };

  return (
    <div className="relative h-[70vh] w-full overflow-hidden rounded-xl border border-indigo-200 dark:border-indigo-800/40">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onPaneClick={() => setSelectedId(null)}
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

      {selectedNode && (
        <NodeDetailPanel node={selectedNode} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}

function NodeDetailPanel({
  node,
  onClose,
}: {
  node: EnrichedGraphNode;
  onClose: () => void;
}) {
  const metadataEntries = Object.entries(node.metadata ?? {});

  return (
    <div className="absolute right-3 top-3 z-10 flex w-72 flex-col gap-3 rounded-xl border border-indigo-200 bg-white p-4 shadow-lg dark:border-indigo-800/40 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-slate-400">{node.type}</p>
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">{node.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-indigo-700"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      {node.description && (
        <p className="text-sm text-slate-600 dark:text-slate-300">{node.description}</p>
      )}

      <div className="flex items-center justify-between text-xs">
        <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {node.status.replaceAll("_", " ")}
        </span>
        <span className="font-medium text-slate-500">{node.progress}%</span>
      </div>

      {node.shouldCompleteBy && (
        <Field label="Should complete by" value={node.shouldCompleteBy} />
      )}

      {node.assignment && (
        <Field
          label="Assigned to"
          value={`${node.assignment.contractorName} (${node.assignment.assignmentType})`}
        />
      )}

      {metadataEntries.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-400">Metadata</p>
          <dl className="mt-1 flex flex-col gap-1">
            {metadataEntries.map(([key, value]) => (
              <div key={key} className="flex justify-between gap-2 text-xs">
                <dt className="text-slate-500">{key}</dt>
                <dd className="text-right text-slate-700 dark:text-slate-300">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="flex flex-col gap-1 border-t border-black/5 pt-2 text-xs text-slate-400 dark:border-white/5">
        {node.creatorName && <span>Created by {node.creatorName}</span>}
        <span>Created {new Date(node.createdAt).toLocaleDateString()}</span>
        <span>Updated {new Date(node.updatedAt).toLocaleDateString()}</span>
        <span className="font-mono">{node.id}</span>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-700 dark:text-slate-300">{value}</span>
    </div>
  );
}
