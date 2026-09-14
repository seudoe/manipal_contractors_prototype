"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Network, List as ListIcon, RotateCcw, Save, Sparkles } from "lucide-react";
import {
  createDefaultDraft,
  createChildNode,
  updateNodeInTree,
  addChildInTree,
  removeNodeFromTree,
  findNodeInTree,
  type DraftProject,
  type DraftNode,
} from "@/lib/new-project/types";
import { loadDraft, saveDraft, clearDraft } from "@/lib/new-project/storage";
import { DraftGraphFlow } from "@/components/new-project/draft-graph-flow";
import { DraftTreeList } from "@/components/new-project/draft-tree-list";
import { NodeEditorSidebar } from "@/components/new-project/node-editor-sidebar";
import { GenerateGraphModal } from "@/components/new-project/generate-graph-modal";

type SubTab = "graph" | "list";

export function NewProjectEditor({ email }: { email: string }) {
  const [draft, setDraft] = useState<DraftProject | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SubTab>("graph");
  const [graphMounted, setGraphMounted] = useState(true);
  const [showAiModal, setShowAiModal] = useState(false);
  const hydrated = useRef(false);

  // Load from localStorage once, on mount (per-user, keyed by email).
  useEffect(() => {
    const loaded = loadDraft(email) ?? createDefaultDraft();
    setDraft(loaded);
    setSelectedId(loaded.root.id);
    hydrated.current = true;
  }, [email]);

  // Mirror every change straight to localStorage — there is no explicit
  // "save" step for persistence; the "Save Project" button below is a
  // separate, intentionally-unimplemented action (see its onClick).
  useEffect(() => {
    if (!draft || !hydrated.current) return;
    saveDraft(email, draft);
  }, [draft, email]);

  const selectTab = (tab: SubTab) => {
    if (tab === "graph") setGraphMounted(true);
    setActiveTab(tab);
  };

  const handleUpdateNode = useCallback((nodeId: string, patch: Partial<DraftNode>) => {
    setDraft((prev) =>
      prev ? { ...prev, root: updateNodeInTree(prev.root, nodeId, (n) => ({ ...n, ...patch })) } : prev
    );
  }, []);

  const handleAddChild = useCallback((parentId: string) => {
    const child = createChildNode();
    setDraft((prev) => (prev ? { ...prev, root: addChildInTree(prev.root, parentId, child) } : prev));
    setSelectedId(child.id);
  }, []);

  const handleDelete = useCallback((nodeId: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      if (nodeId === prev.root.id) return prev; // never delete the root
      return { ...prev, root: removeNodeFromTree(prev.root, nodeId) };
    });
    setSelectedId((current) => (current === nodeId ? null : current));
  }, []);

  const handleSetDomain = useCallback((domain: string) => {
    setDraft((prev) => (prev ? { ...prev, domain } : prev));
  }, []);

  function handleInsertGenerated(result: { mode: "replace" | "edit"; root: DraftNode; domain?: string }) {
    if (!draft) return;
    if (result.mode === "replace" && draft.root.children.length > 0) {
      const ok = window.confirm(
        "This replaces everything in the working area with the generated graph. Continue?"
      );
      if (!ok) return;
    }
    setDraft({ domain: result.domain ?? draft.domain, root: result.root });
    setSelectedId(result.root.id);
    setShowAiModal(false);
  }

  function handleReset() {
    if (!window.confirm("Discard this draft and start over? This can't be undone.")) return;
    clearDraft(email);
    const fresh = createDefaultDraft();
    setDraft(fresh);
    setSelectedId(fresh.root.id);
  }

  if (!draft) {
    return <div className="flex flex-1 items-center justify-center text-sm text-slate-400">Loading…</div>;
  }

  const selectedNode = selectedId ? findNodeInTree(draft.root, selectedId) : undefined;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">New Project</h1>
        <p className="text-sm text-slate-500">
          Build out the feature graph, then use the buttons below when you're ready.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800" style={{ width: "fit-content" }}>
          <TabButton active={activeTab === "graph"} onClick={() => selectTab("graph")} icon={Network}>
            Graph
          </TabButton>
          <TabButton active={activeTab === "list"} onClick={() => selectTab("list")} icon={ListIcon}>
            List
          </TabButton>
        </div>

        <button
          type="button"
          onClick={() => setShowAiModal(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 px-3.5 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800/50 dark:text-indigo-300 dark:hover:bg-indigo-950"
        >
          <Sparkles size={16} />
          Generate Graph with AI
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden rounded-xl border border-indigo-200 dark:border-indigo-800/40">
        <div className="flex-1">
          {/* Both tabs stay mounted once visited — toggled with CSS only, so
              switching between them never refetches/remounts state (react-flow's
              viewport, list expand/collapse, etc. all survive). */}
          {graphMounted && (
            <div className={activeTab === "graph" ? "block h-full" : "hidden"}>
              <DraftGraphFlow
                root={draft.root}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onAddChild={handleAddChild}
              />
            </div>
          )}
          <div className={activeTab === "list" ? "block h-full" : "hidden"}>
            <DraftTreeList
              root={draft.root}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onAddChild={handleAddChild}
            />
          </div>
        </div>

        {selectedNode && (
          <NodeEditorSidebar
            key={selectedNode.id}
            node={selectedNode}
            isRoot={selectedNode.id === draft.root.id}
            domain={draft.domain}
            onUpdateNode={(patch) => handleUpdateNode(selectedNode.id, patch)}
            onSetDomain={handleSetDomain}
            onAddChild={() => handleAddChild(selectedNode.id)}
            onDelete={() => handleDelete(selectedNode.id)}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-indigo-100 pt-4 dark:border-indigo-800/40">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-indigo-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          type="button"
          title="Not implemented yet"
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          <Save size={16} />
          Save Project
        </button>
      </div>

      {showAiModal && (
        <GenerateGraphModal
          currentRoot={draft.root}
          hasExistingContent={draft.root.children.length > 0}
          onClose={() => setShowAiModal(false)}
          onInsert={handleInsertGenerated}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Network;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-950 dark:text-indigo-300"
          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
      }`}
    >
      <Icon size={16} />
      {children}
    </button>
  );
}
