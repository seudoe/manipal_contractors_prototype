"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

export interface ContractorNodeData extends Record<string, unknown> {
  name: string;
  role: "MAIN_CONTRACTOR" | "SUBCONTRACTOR";
  features: string[];
}

const handleClass =
  "!h-2 !w-2 !border !border-white !bg-slate-400 dark:!border-slate-900 dark:!bg-slate-500";

export function ContractorNode({ data, selected }: NodeProps & { data: ContractorNodeData }) {
  return (
    <div
      className={`flex h-full w-full cursor-grab flex-col justify-center gap-1 rounded-lg border bg-white px-3 py-2 shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900 ${
        selected
          ? "border-black ring-2 ring-black/20 dark:border-white dark:ring-white/20"
          : "border-black/15 dark:border-indigo-800/50"
      }`}
    >
      <Handle type="target" position={Position.Top} id="t" className={handleClass} />

      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">
          {data.name}
        </span>
        {data.role === "MAIN_CONTRACTOR" && (
          <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800">
            MAIN
          </span>
        )}
      </div>
      {data.features.length > 0 && (
        <p className="truncate text-xs text-slate-500">{data.features.join(", ")}</p>
      )}

      <Handle type="source" position={Position.Bottom} id="b" className={handleClass} />
    </div>
  );
}
