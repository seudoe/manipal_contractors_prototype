"use client";

import { useState } from "react";
import { CollusionGraphFlow } from "@/components/graph/collusion-graph-flow";
import type { CollusionFinding, CollusionGraphNode, CollusionGraphEdge } from "@/types/collusion";

/**
 * ANUBANDH — the collusion graph screen's client half (TASK 8.4). Clicking
 * a finding highlights its edge in the graph; clicking an edge highlights
 * its finding. All data is read-only, hand-authored in db/collusion.ts.
 */
export function CollusionBoard({
  nodes,
  edges,
  findings,
}: {
  nodes: CollusionGraphNode[];
  edges: CollusionGraphEdge[];
  findings: CollusionFinding[];
}) {
  const [highlighted, setHighlighted] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <CollusionGraphFlow
        nodes={nodes}
        edges={edges}
        highlightedFindingId={highlighted}
        onEdgeClick={setHighlighted}
      />

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Findings</p>
        {findings.map((f) => (
          <button
            key={f.id}
            onClick={() => setHighlighted(f.id === highlighted ? null : f.id)}
            className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors ${
              highlighted === f.id
                ? "border-black bg-zinc-50 dark:border-white dark:bg-zinc-800"
                : "border-black/10 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  f.severity === "HIGH"
                    ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                }`}
              >
                {f.severity}
              </span>
              <span className="text-xs font-medium text-zinc-500">
                {f.motifType.replaceAll("_", " ")}
              </span>
            </div>
            <p className="text-sm text-black dark:text-zinc-50">{f.explanation}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
