"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import type { DraftNodeType } from "@/lib/new-project/types";

const handleClass =
  "!h-2 !w-2 !border !border-white !bg-slate-400 dark:!border-slate-900 dark:!bg-slate-500";

export interface DraftFeatureNodeData extends Record<string, unknown> {
  label: string;
  nodeType: DraftNodeType;
  hasChildren: boolean;
  collapsed: boolean;
  descendantCount: number;
  onAddChild: (nodeId: string) => void;
  onToggleCollapse: (nodeId: string) => void;
}

export function DraftFeatureNode({ id, data, selected }: NodeProps & { data: DraftFeatureNodeData }) {
  const isRoot = data.nodeType === "PROJECT";

  return (
    <div
      className={`group relative flex h-full w-full cursor-pointer items-center gap-2 rounded-lg border bg-white px-3 py-2 shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900 ${
        selected
          ? "border-indigo-500 ring-2 ring-indigo-500/20"
          : "border-indigo-200 dark:border-indigo-800/50"
      } ${isRoot ? "font-semibold" : ""}`}
    >
      <Handle type="target" position={Position.Top} id="t" className={handleClass} />

      <span className="truncate text-sm text-slate-900 dark:text-slate-50">{data.label}</span>

      <button
        type="button"
        title="Add child node"
        onClick={(e) => {
          e.stopPropagation();
          data.onAddChild(id);
        }}
        className="absolute -right-2.5 -top-2.5 flex h-5 w-5 items-center justify-center rounded-full border border-indigo-300 bg-white text-indigo-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:border-indigo-700 dark:bg-slate-800 dark:text-indigo-300"
      >
        <Plus size={12} strokeWidth={3} />
      </button>

      {data.hasChildren && (
        <button
          type="button"
          title={
            data.collapsed
              ? `Show ${data.descendantCount} hidden node${data.descendantCount === 1 ? "" : "s"}`
              : "Collapse child nodes"
          }
          onClick={(e) => {
            e.stopPropagation();
            data.onToggleCollapse(id);
          }}
          className="absolute -bottom-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-indigo-300 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 shadow-sm dark:border-indigo-700 dark:bg-slate-800 dark:text-indigo-300"
        >
          {data.collapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
          {data.collapsed && data.descendantCount}
        </button>
      )}

      <Handle type="source" position={Position.Bottom} id="b" className={handleClass} />
    </div>
  );
}
