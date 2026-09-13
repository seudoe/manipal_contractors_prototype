import type { PriorityFactor } from "@/types/deviation";

/**
 * ANUBANDH shared primitive — renders a priorityFactors array as a readable
 * breakdown ending in the final priority number. Purely presentational: it
 * does not calculate anything, it only lays out numbers that were already
 * hand-authored on the Deviation record.
 */
export function PriorityPanel({
  factors,
  priority,
}: {
  factors: PriorityFactor[];
  priority: number;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
        Priority breakdown
      </p>
      <ul className="flex flex-col gap-1.5">
        {factors.map((f) => (
          <li key={f.label} className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-300">{f.label}</span>
            <span className="font-mono font-medium text-black dark:text-zinc-50">{f.value}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3 dark:border-white/10">
        <span className="text-sm font-semibold text-black dark:text-zinc-50">
          Priority score
        </span>
        <span className="rounded-md bg-black px-2 py-1 font-mono text-sm font-bold text-white dark:bg-white dark:text-black">
          {priority.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
