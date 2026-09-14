"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FileText, Plus } from "lucide-react";
import type { DraftNode } from "@/lib/new-project/types";

export function DraftTreeList({
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
  return (
    <div className="flex flex-col gap-0.5 overflow-auto p-2">
      <TreeRow
        node={root}
        depth={0}
        selectedId={selectedId}
        onSelect={onSelect}
        onAddChild={onAddChild}
      />
    </div>
  );
}

function TreeRow({
  node,
  depth,
  selectedId,
  onSelect,
  onAddChild,
}: {
  node: DraftNode;
  depth: number;
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
  onAddChild: (nodeId: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const isSelected = node.id === selectedId;

  return (
    <div>
      <div
        onClick={() => onSelect(node.id)}
        style={{ paddingLeft: depth * 20 }}
        className={`group flex cursor-pointer items-center gap-1.5 rounded-lg py-1.5 pr-2 text-sm transition-colors ${
          isSelected
            ? "bg-indigo-100 dark:bg-indigo-950"
            : "hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className={`flex h-4 w-4 shrink-0 items-center justify-center text-slate-400 ${
            hasChildren ? "" : "invisible"
          }`}
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {hasChildren ? (
          <Folder size={15} className="shrink-0 text-indigo-400" />
        ) : (
          <FileText size={15} className="shrink-0 text-slate-400" />
        )}

        <span className="truncate text-slate-800 dark:text-slate-200">
          {node.name || "(unnamed)"}
        </span>

        <button
          type="button"
          title="Add child node"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(true);
            onAddChild(node.id);
          }}
          className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded text-slate-400 opacity-0 hover:bg-slate-200 group-hover:opacity-100 dark:hover:bg-slate-700"
        >
          <Plus size={13} />
        </button>
      </div>

      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}
