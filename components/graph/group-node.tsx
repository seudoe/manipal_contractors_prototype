"use client";

import type { NodeProps } from "@xyflow/react";

export interface GroupNodeData extends Record<string, unknown> {
  label: string;
}

/**
 * A light-bordered rectangle drawn behind a cluster of feature nodes to show
 * "this work is handed off to this subcontractor". Its member nodes are
 * real @xyflow/react children (parentId + extent:"parent"), so dragging
 * this box moves the whole cluster together, and dragging a member node
 * stays confined inside it.
 */
export function GroupNode({ data }: NodeProps & { data: GroupNodeData }) {
  return (
    <div className="h-full w-full cursor-grab rounded-xl border border-dashed border-black/20 bg-indigo-600/[0.025] dark:border-white/20 dark:bg-indigo-500/[0.03]">
      <span className="absolute -top-[22px] left-1 select-none text-xs font-medium text-slate-500">
        {data.label}
      </span>
    </div>
  );
}
