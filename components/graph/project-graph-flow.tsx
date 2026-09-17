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
import { X, Share2, GitCompare } from "lucide-react";
import type { GraphNode, GraphEdge } from "@/types/graph";
import { layoutWithDagre, boundingBoxOf, NODE_WIDTH, NODE_HEIGHT } from "@/lib/graph/layout";
import {
  effectsAtEntry,
  compareWithOriginal,
  type GraphChangeHistory,
} from "@/lib/graph/change-history";
import { severityColor } from "@/lib/graph/severity-color";
import { FeatureNode, type FeatureNodeData } from "./feature-node";
import { GroupNode, type GroupNodeData } from "./group-node";
import { ChangeHistoryList } from "./change-history-list";

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

/**
 * Unified comparison state: "none", "original" (max severity across the
 * whole chain), or a specific entry index — clicking a Change history row
 * shows "the graph at that point in time" using just that entry's effects.
 * "Compare with Last Change" is the same thing as clicking entry 0.
 */
type CompareMode = "none" | "original" | number;

export function ProjectGraphFlow({
  nodes,
  edges,
  groups,
  assignableContractors,
  changeHistory,
}: {
  nodes: EnrichedGraphNode[];
  edges: GraphEdge[];
  groups: SubcontractorGroup[];
  /** only passed for a contractor session — gates the "Assign to other contractor" button */
  assignableContractors?: { id: string; name: string }[];
  /** only present for projects with hardcoded change data (see lib/graph/change-history.ts) */
  changeHistory?: GraphChangeHistory;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState<CompareMode>("none");

  const severityByNode = useMemo(() => {
    if (compareMode === "none" || !changeHistory) return null;
    return compareMode === "original"
      ? compareWithOriginal(changeHistory.effects)
      : effectsAtEntry(changeHistory.effects, compareMode);
  }, [compareMode, changeHistory]);

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
        data: {
          label: node.name,
          status: node.status,
          nodeType: node.type,
          changeColor: severityByNode ? severityColor(severityByNode.get(node.id)) : undefined,
        } satisfies FeatureNodeData,
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
  }, [nodes, edges, groups, severityByNode]);

  const selectedNode = selectedId ? nodes.find((n) => n.id === selectedId) : undefined;

  const handleNodeClick: NodeMouseHandler = (_event, node) => {
    if (node.type === "group") return;
    setSelectedId(node.id);
  };

  function toggleCompare(mode: "original" | number) {
    setCompareMode((current) => (current === mode ? "none" : mode));
  }

  return (
    <div className="flex flex-col gap-4">
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

        {changeHistory && (
          <div className="absolute left-3 top-3 z-10 flex gap-2">
            <CompareButton
              active={compareMode === "original"}
              onClick={() => toggleCompare("original")}
            >
              Compare with Original
            </CompareButton>
            <CompareButton active={compareMode === 0} onClick={() => toggleCompare(0)}>
              Compare with Last Change
            </CompareButton>
          </div>
        )}

        {selectedNode && (
          <NodeDetailPanel
            node={selectedNode}
            onClose={() => setSelectedId(null)}
            assignableContractors={assignableContractors}
          />
        )}
      </div>

      {changeHistory && (
        <ChangeHistoryList
          history={changeHistory}
          activeIndex={typeof compareMode === "number" ? compareMode : null}
          onSelect={(index) => toggleCompare(index)}
        />
      )}
    </div>
  );
}

function CompareButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm transition-colors ${
        active
          ? "border-indigo-600 bg-indigo-600 text-white"
          : "border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800/50 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-indigo-950"
      }`}
    >
      <GitCompare size={13} />
      {children}
    </button>
  );
}

function NodeDetailPanel({
  node,
  onClose,
  assignableContractors,
}: {
  node: EnrichedGraphNode;
  onClose: () => void;
  assignableContractors?: { id: string; name: string }[];
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

      {assignableContractors && assignableContractors.length > 0 && (
        <AssignFeatureControl contractors={assignableContractors} />
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

/**
 * Demo-only affordance — shows the contractor hierarchy is meant to keep
 * going ("a contractor can hand this off to a sub-contractor, who can hand
 * it off further"). Picking a contractor from the list does nothing; this
 * is here to gesture at the idea in a demo, not to actually reassign work.
 */
function AssignFeatureControl({ contractors }: { contractors: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative border-t border-black/5 pt-3 dark:border-white/5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-center gap-1.5 rounded-full border border-indigo-200 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800/50 dark:text-indigo-300 dark:hover:bg-indigo-950"
      >
        <Share2 size={13} />
        Assign to other contractor
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute bottom-full left-0 z-20 mb-2 w-full rounded-lg border border-indigo-200 bg-white p-1.5 shadow-lg dark:border-indigo-800/50 dark:bg-slate-900">
            {contractors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-md px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {c.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
