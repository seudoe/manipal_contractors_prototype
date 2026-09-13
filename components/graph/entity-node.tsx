"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

/**
 * ANUBANDH — collusion graph node renderer (TASK 8). This graph is
 * relational, not hierarchical (firms cluster rather than rank), so unlike
 * feature-node.tsx / contractor-node.tsx it is NOT laid out by dagre in one
 * fixed direction — nodes sit at hand-authored positions from
 * db/collusion.ts. Edges between them can therefore point any which way, so
 * this node exposes a source+target handle pair on all four sides instead
 * of baking in one fixed direction; collusion-graph-flow.tsx picks the pair
 * that matches each edge's actual relative position.
 */
export interface EntityNodeData extends Record<string, unknown> {
  label: string;
  gstin?: string;
  incorporationDate?: string;
  highlighted?: boolean;
}

const handleClass =
  "!h-2 !w-2 !border !border-white !bg-zinc-400 dark:!border-zinc-900 dark:!bg-zinc-500";

export function EntityNode({ data, selected }: NodeProps & { data: EntityNodeData }) {
  return (
    <div
      className={`flex h-full w-full cursor-grab flex-col justify-center gap-0.5 rounded-lg border bg-white px-3 py-2 shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900 ${
        selected || data.highlighted
          ? "border-black ring-2 ring-black/20 dark:border-white dark:ring-white/20"
          : "border-black/15 dark:border-white/15"
      }`}
    >
      <Handle type="target" position={Position.Top} id="top-target" className={handleClass} />
      <Handle type="source" position={Position.Top} id="top-source" className={handleClass} />
      <Handle type="target" position={Position.Bottom} id="bottom-target" className={handleClass} />
      <Handle type="source" position={Position.Bottom} id="bottom-source" className={handleClass} />
      <Handle type="target" position={Position.Left} id="left-target" className={handleClass} />
      <Handle type="source" position={Position.Left} id="left-source" className={handleClass} />
      <Handle type="target" position={Position.Right} id="right-target" className={handleClass} />
      <Handle type="source" position={Position.Right} id="right-source" className={handleClass} />

      <span className="truncate text-sm font-medium text-black dark:text-zinc-50">{data.label}</span>
      {data.gstin && <span className="truncate text-[10px] text-zinc-500">{data.gstin}</span>}
      {data.incorporationDate && (
        <span className="truncate text-[10px] text-zinc-400">Inc. {data.incorporationDate}</span>
      )}
    </div>
  );
}
