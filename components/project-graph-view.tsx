import { ArrowRight } from "lucide-react";
import { getProjectGraph, getNodeById } from "@/db/queries";

const STATUS_STYLES: Record<string, string> = {
  NOT_STARTED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  IN_PROGRESS: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  BLOCKED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

/**
 * Read-only, list-based rendering of the project graph — nodes with status
 * and progress, plus the dependency edges. Stands in for a real React Flow
 * canvas (spec section 48) until that's wired up.
 */
export function ProjectGraphView({ projectId }: { projectId: string }) {
  const { nodes, edges } = getProjectGraph(projectId);

  if (nodes.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-black/10 p-8 text-center text-sm text-zinc-500 dark:border-white/15">
        No graph nodes yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-zinc-500">Features</h3>
        {nodes.map((node) => (
          <div
            key={node.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-zinc-900"
          >
            <div>
              <p className="text-sm font-medium text-black dark:text-zinc-50">
                {node.name}
                <span className="ml-2 text-xs font-normal text-zinc-400">
                  {node.type}
                </span>
              </p>
              {node.description && (
                <p className="text-xs text-zinc-500">{node.description}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-xs font-medium text-zinc-500">
                {node.progress}%
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  STATUS_STYLES[node.status] ?? STATUS_STYLES.NOT_STARTED
                }`}
              >
                {node.status.replaceAll("_", " ")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {edges.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-zinc-500">Dependencies</h3>
          {edges.map((edge) => {
            const source = getNodeById(edge.sourceNodeId);
            const target = getNodeById(edge.targetNodeId);
            return (
              <div
                key={edge.id}
                className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10"
              >
                <span className="text-zinc-600 dark:text-zinc-300">{source?.name ?? edge.sourceNodeId}</span>
                <ArrowRight size={14} className="shrink-0 text-zinc-400" />
                <span className="text-zinc-600 dark:text-zinc-300">{target?.name ?? edge.targetNodeId}</span>
                <span className="ml-auto text-xs text-zinc-400">
                  {target?.name ?? "target"} depends on {source?.name ?? "source"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
