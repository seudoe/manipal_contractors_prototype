"use client";

import { useState } from "react";
import { Sparkles, X, Loader2 } from "lucide-react";
import { generateHardcodedTree, applyHardcodedEdit } from "@/lib/new-project/ai-generate";
import { DraftGraphFlow } from "@/components/new-project/draft-graph-flow";
import type { DraftNode } from "@/lib/new-project/types";

/**
 * Prototype-only, two stages:
 * 1. Prompt — describe the project, optionally "tag the current graph" so
 *    the AI edits it instead of generating fresh. "Generate" fakes 2s of
 *    processing then always returns the same hardcoded result (see
 *    lib/new-project/ai-generate.ts) regardless of the prompt text.
 * 2. Preview — shows the generated graph in the popup itself (in case the
 *    "AI" got it wrong) before it touches the real working area. From here:
 *    Back (stage 1, prompt kept), Cancel (close, nothing inserted), or
 *    Insert into working area (applies it and closes).
 */
type Stage = "prompt" | "preview";

interface GeneratedResult {
  mode: "replace" | "edit";
  root: DraftNode;
  domain?: string;
}

export function GenerateGraphModal({
  currentRoot,
  hasExistingContent,
  onClose,
  onInsert,
}: {
  /** the draft's current root — read when "tag the current graph" is checked */
  currentRoot: DraftNode;
  hasExistingContent: boolean;
  onClose: () => void;
  onInsert: (result: GeneratedResult) => void;
}) {
  const [stage, setStage] = useState<Stage>("prompt");
  const [prompt, setPrompt] = useState("");
  const [tagExistingGraph, setTagExistingGraph] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [previewSelectedId, setPreviewSelectedId] = useState<string | null>(null);

  function handleGenerate() {
    setProcessing(true);
    setTimeout(() => {
      const generated: GeneratedResult = tagExistingGraph
        ? { mode: "edit", root: applyHardcodedEdit(currentRoot) }
        : { mode: "replace", ...generateHardcodedTree(prompt) };
      setResult(generated);
      setPreviewSelectedId(generated.root.id);
      setProcessing(false);
      setStage("preview");
    }, 2000);
  }

  function handleBack() {
    setResult(null);
    setStage("prompt");
  }

  function handleInsert() {
    if (result) onInsert(result);
  }

  const isPreview = stage === "preview" && result;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={`flex w-full flex-col gap-4 rounded-xl border border-indigo-200 bg-white p-5 shadow-xl dark:border-indigo-800/50 dark:bg-slate-900 ${
          isPreview ? "max-w-4xl" : "max-w-lg"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-500" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              {isPreview ? "Preview generated graph" : "Generate Graph with AI"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        {isPreview ? (
          <>
            <p className="text-sm text-slate-500">
              Check it over before it touches your working area — nothing has been inserted yet.
            </p>
            <div className="h-[55vh] w-full overflow-hidden rounded-lg border border-indigo-100 dark:border-indigo-800/40">
              <DraftGraphFlow
                root={result.root}
                selectedId={previewSelectedId}
                onSelect={setPreviewSelectedId}
                onAddChild={() => {}}
              />
            </div>
          </>
        ) : (
          <>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the project — e.g. a 200-bed district hospital with electrical, plumbing, and medical equipment features…"
              rows={6}
              disabled={processing}
              className="input resize-none"
            />

            {hasExistingContent && (
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={tagExistingGraph}
                  onChange={(e) => setTagExistingGraph(e.target.checked)}
                  disabled={processing}
                  className="h-4 w-4 accent-indigo-600"
                />
                Tag the current graph — let the AI edit it instead of generating a new one
              </label>
            )}

            {processing && (
              <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                <Loader2 size={16} className="animate-spin" />
                Processing…
              </div>
            )}
          </>
        )}

        <div className="flex justify-end gap-2">
          {isPreview ? (
            <>
              <button
                type="button"
                onClick={handleBack}
                className="rounded-full border border-indigo-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-indigo-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-indigo-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-indigo-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsert}
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Insert into working area
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={processing}
                className="rounded-full border border-indigo-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:border-indigo-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={processing}
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                Generate
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
