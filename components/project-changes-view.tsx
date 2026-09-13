import {
  getProjectChanges,
  getUserById,
  getNodeById,
  getChangeReviews,
  getChangeRiskScore,
} from "@/db/queries";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  APPROVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  NEEDS_EVIDENCE: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW: "text-slate-500",
  MEDIUM: "text-amber-600 dark:text-amber-400",
  HIGH: "text-red-600 dark:text-red-400",
};

/**
 * Read-only version/change history — spec section 16/17/23. Shows
 * before/after, reason, who changed it, review status, and risk score.
 */
export function ProjectChangesView({ projectId }: { projectId: string }) {
  const changes = getProjectChanges(projectId);

  if (changes.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-indigo-200 p-8 text-center text-sm text-slate-500 dark:border-indigo-800/50">
        No changes recorded yet — this project is still on its baseline.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {changes.map((change) => {
        const author = getUserById(change.createdBy);
        const node = change.nodeId ? getNodeById(change.nodeId) : undefined;
        const reviews = getChangeReviews(change.id);
        const risk = getChangeRiskScore(change.id);

        return (
          <div
            key={change.id}
            className="flex flex-col gap-3 rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-800/40 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {change.changeType.replaceAll("_", " ")}
                  {node && <span className="font-normal text-slate-500"> · {node.name}</span>}
                </p>
                <p className="text-xs text-slate-500">
                  {author?.name ?? change.createdBy} · {new Date(change.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  STATUS_STYLES[change.status] ?? STATUS_STYLES.PENDING
                }`}
              >
                {change.status.replaceAll("_", " ")}
              </span>
            </div>

            {(change.oldValue !== undefined || change.newValue !== undefined) && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {String(change.oldValue ?? "—")}
                </span>
                <span className="text-slate-400">→</span>
                <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {String(change.newValue ?? "—")}
                </span>
              </div>
            )}

            {change.reason && (
              <p className="text-sm text-slate-600 dark:text-slate-300">{change.reason}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 border-t border-black/5 pt-3 text-xs text-slate-500 dark:border-white/5">
              {risk && (
                <span>
                  Risk score: <strong className={PRIORITY_STYLES[risk.priority]}>{risk.score} ({risk.priority})</strong>
                </span>
              )}
              {reviews.length > 0 ? (
                reviews.map((r) => (
                  <span key={r.id}>
                    Reviewed by {getUserById(r.reviewerId)?.name ?? r.reviewerId}: <strong>{r.decision}</strong>
                  </span>
                ))
              ) : (
                <span>Awaiting review</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
