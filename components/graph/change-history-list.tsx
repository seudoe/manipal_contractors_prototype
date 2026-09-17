import { History } from "lucide-react";
import { maxEffectOf, type GraphChangeHistory } from "@/lib/graph/change-history";
import { severityColor } from "@/lib/graph/severity-color";

/**
 * Read-only-except-for-selection list under the graph canvas — spec MVP
 * ask: "see the difference between original commitment and what changed."
 * entries[0] is the most recent change, entries[4] is the original
 * baseline itself (see lib/graph/change-history.ts). Clicking an entry
 * colors the graph with just that step's effects — see
 * components/graph/project-graph-flow.tsx's unified `activeComparison` state.
 */
export function ChangeHistoryList({
  history,
  activeIndex,
  onSelect,
}: {
  history: GraphChangeHistory;
  activeIndex: number | null;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <History size={16} className="text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Change history
        </h3>
      </div>

      <div className="flex flex-col gap-2">
        {history.entries.map((entry, i) => {
          const effects = history.effects[i] ?? [];
          const dotColor = severityColor(maxEffectOf(effects));
          const isMostRecent = i === 0;
          const isOriginal = i === history.entries.length - 1;
          const active = activeIndex === i;

          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSelect(i)}
              className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                active
                  ? "border-indigo-500 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950"
                  : "border-indigo-200 bg-white hover:bg-slate-50 dark:border-indigo-800/40 dark:bg-slate-900 dark:hover:bg-slate-800"
              }`}
            >
              <span
                style={{ backgroundColor: dotColor }}
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm text-slate-800 dark:text-slate-200">{entry.summary}</p>
                  {isMostRecent && (
                    <span className="shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      Most recent
                    </span>
                  )}
                  {isOriginal && (
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800">
                      Original
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  {entry.changedBy} · {new Date(entry.date).toLocaleDateString()}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
