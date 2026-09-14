"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { DraftNode, DraftNodeType } from "@/lib/new-project/types";

const TYPE_OPTIONS: DraftNodeType[] = ["FEATURE", "SUBFEATURE"];

interface MetaRow {
  id: string;
  key: string;
  value: string;
}

function metadataToRows(metadata: Record<string, string>): MetaRow[] {
  return Object.entries(metadata).map(([key, value], i) => ({ id: `row-${i}-${key}`, key, value }));
}

function rowsToMetadata(rows: MetaRow[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const row of rows) {
    const key = row.key.trim();
    if (key) out[key] = row.value;
  }
  return out;
}

export function NodeEditorSidebar({
  node,
  isRoot,
  domain,
  onUpdateNode,
  onSetDomain,
  onAddChild,
  onDelete,
  onClose,
}: {
  node: DraftNode;
  isRoot: boolean;
  domain: string;
  onUpdateNode: (patch: Partial<DraftNode>) => void;
  onSetDomain: (domain: string) => void;
  onAddChild: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  // Kept as a separate local array (not derived from node.metadata on every
  // render) so an in-progress key rename doesn't remount the input on every
  // keystroke — each row has a stable id independent of its current key text.
  const [metaRows, setMetaRows] = useState<MetaRow[]>(() => metadataToRows(node.metadata));

  function syncMetadata(rows: MetaRow[]) {
    setMetaRows(rows);
    onUpdateNode({ metadata: rowsToMetadata(rows) });
  }

  function updateRow(id: string, patch: Partial<MetaRow>) {
    syncMetadata(metaRows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRow() {
    syncMetadata([...metaRows, { id: `row-new-${crypto.randomUUID()}`, key: "", value: "" }]);
  }

  function removeRow(id: string) {
    syncMetadata(metaRows.filter((r) => r.id !== id));
  }

  return (
    <div className="flex h-full w-80 shrink-0 flex-col gap-4 overflow-y-auto border-l border-indigo-200 bg-white p-4 dark:border-indigo-800/40 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {isRoot ? "Project" : node.nodeType}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X size={16} />
        </button>
      </div>

      {/* Mandatory fields */}
      <Field label="Name">
        <input
          value={node.name}
          onChange={(e) => onUpdateNode({ name: e.target.value })}
          placeholder={isRoot ? "Project name" : "Feature name"}
          className="input"
        />
      </Field>

      {isRoot && (
        <Field label="Domain">
          <input
            value={domain}
            onChange={(e) => onSetDomain(e.target.value)}
            placeholder="e.g. Transit Infrastructure"
            className="input"
          />
        </Field>
      )}

      {!isRoot && (
        <Field label="Type">
          <select
            value={node.nodeType}
            onChange={(e) => onUpdateNode({ nodeType: e.target.value as DraftNodeType })}
            className="input"
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      )}

      {/* Optional fields */}
      <Field label="Description (optional)">
        <textarea
          value={node.description ?? ""}
          onChange={(e) => onUpdateNode({ description: e.target.value })}
          rows={3}
          className="input resize-none"
        />
      </Field>

      <Field label="Should complete by (optional)">
        <input
          type="date"
          value={node.shouldCompleteBy ?? ""}
          onChange={(e) => onUpdateNode({ shouldCompleteBy: e.target.value || undefined })}
          className="input"
        />
      </Field>

      {/* Field-specific optional details — free-form key/value pairs, both editable */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-slate-500">Other details (optional)</p>
        {metaRows.map((row) => (
          <div key={row.id} className="flex items-center gap-1.5">
            <input
              value={row.key}
              onChange={(e) => updateRow(row.id, { key: e.target.value })}
              placeholder="key (e.g. material)"
              className="input flex-1"
            />
            <input
              value={row.value}
              onChange={(e) => updateRow(row.id, { value: e.target.value })}
              placeholder="value (e.g. concrete)"
              className="input flex-1"
            />
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              className="shrink-0 rounded p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addRow}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-200 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800/50 dark:text-indigo-400 dark:hover:bg-indigo-950"
        >
          <Plus size={14} />
          Add detail
        </button>
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t border-indigo-100 pt-4 dark:border-indigo-800/40">
        <button
          type="button"
          onClick={onAddChild}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          <Plus size={16} />
          Add child node
        </button>
        {!isRoot && (
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
          >
            <Trash2 size={16} />
            Delete node
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      {children}
    </label>
  );
}
