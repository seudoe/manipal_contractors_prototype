"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { GraphNodeStatus, GraphNodeType } from "@/types/graph";

const STATUS_DOT: Record<GraphNodeStatus, string> = {
  NOT_STARTED: "bg-slate-400",
  IN_PROGRESS: "bg-amber-500",
  COMPLETED: "bg-emerald-500",
  BLOCKED: "bg-red-500",
};

const handleClass =
  "!h-2 !w-2 !border !border-white !bg-slate-400 dark:!border-slate-900 dark:!bg-slate-500";

export interface FeatureNodeData extends Record<string, unknown> {
  label: string;
  status: GraphNodeStatus;
  nodeType: GraphNodeType;
  /** hex color from lib/graph/severity-color.ts — set only while a "Compare with…" mode is active */
  changeColor?: string;
}

export function FeatureNode({ data, selected }: NodeProps & { data: FeatureNodeData }) {
  const isRoot = data.nodeType === "PROJECT";

  return (
    <div
      style={
        data.changeColor
          ? { borderColor: data.changeColor, backgroundColor: `${data.changeColor}14` }
          : undefined
      }
      className={`flex h-full w-full cursor-pointer items-center gap-2 rounded-lg border-2 bg-white px-3 py-2 shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900 ${
        data.changeColor
          ? ""
          : selected
            ? "border-black ring-2 ring-black/20 dark:border-white dark:ring-white/20"
            : "border-black/15 dark:border-indigo-800/50"
      } ${isRoot ? "font-semibold" : ""}`}
    >
      {/*
        This graph flows bottom-to-top (dagre rankdir "BT" — see
        lib/graph/layout.ts): a node's dependents/parents render ABOVE it,
        so it must emit its outgoing edge from the top and receive incoming
        edges from below. Backwards from the usual top-down flowchart.
      */}
      <Handle type="source" position={Position.Top} id="t" className={handleClass} />

      <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[data.status]}`} />
      <span className="truncate text-sm text-slate-900 dark:text-slate-50">{data.label}</span>

      <Handle type="target" position={Position.Bottom} id="b" className={handleClass} />
    </div>
  );
}
