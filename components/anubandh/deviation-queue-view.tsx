"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Deviation, DeviationLevel } from "@/types/deviation";
import { LevelBadge } from "./level-badge";
import { TimeRemaining } from "./time-remaining";
import { EmptyState } from "./empty-state";

const LEVELS: DeviationLevel[] = ["L0", "L1", "L2", "L3", "L4"];

export interface QueueRow {
  deviation: Deviation;
  projectName: string;
  href: string;
}

/**
 * ANUBANDH — shared deviation queue table for both the cross-project
 * (/inspector/deviations) and per-project (/inspector/project/[id]/deviations)
 * screens. Rows arrive pre-sorted by the hardcoded priority field; this
 * component only applies DISPLAY filtering (level / project / hide-cosmetic
 * toggle), never re-sorts or re-scores anything.
 */
export function DeviationQueueView({
  rows,
  showProjectFilter = true,
}: {
  rows: QueueRow[];
  showProjectFilter?: boolean;
}) {
  const [levelFilter, setLevelFilter] = useState<DeviationLevel | "ALL">("ALL");
  const [projectFilter, setProjectFilter] = useState<string>("ALL");
  const [hideCosmetic, setHideCosmetic] = useState(true);

  const projectNames = useMemo(
    () => [...new Set(rows.map((r) => r.projectName))],
    [rows]
  );

  const filtered = rows.filter((row) => {
    if (levelFilter !== "ALL" && row.deviation.level !== levelFilter) return false;
    if (projectFilter !== "ALL" && row.projectName !== projectFilter) return false;
    if (hideCosmetic && (row.deviation.level === "L0" || row.deviation.level === "L1")) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-zinc-900">
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value as DeviationLevel | "ALL")}
          className="rounded-md border border-black/10 bg-transparent px-2 py-1.5 text-sm dark:border-white/10"
        >
          <option value="ALL">All levels</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        {showProjectFilter && (
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="rounded-md border border-black/10 bg-transparent px-2 py-1.5 text-sm dark:border-white/10"
          >
            <option value="ALL">All projects</option>
            {projectNames.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        )}

        <label className="ml-auto flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={hideCosmetic}
            onChange={(e) => setHideCosmetic(e.target.checked)}
          />
          Hide cosmetic (L0/L1)
        </label>
      </div>
      <p className="-mt-2 text-xs text-zinc-500">
        Most deviations are innocent — an undifferentiated list of every one is what makes
        officers stop looking. Hiding cosmetic noise by default keeps the queue meaningful.
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No deviations match this filter"
          description="Try clearing a filter or turning off the cosmetic toggle."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-400 dark:border-white/10 dark:bg-zinc-900">
                <th className="px-4 py-2 font-medium">Level</th>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Project</th>
                <th className="px-4 py-2 font-medium">Value at risk</th>
                <th className="px-4 py-2 font-medium">Priority</th>
                <th className="px-4 py-2 font-medium">Time remaining</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ deviation, projectName, href }) => (
                <tr
                  key={deviation.id}
                  className="border-b border-black/5 last:border-0 hover:bg-zinc-50 dark:border-white/5 dark:hover:bg-zinc-900"
                >
                  <td className="px-4 py-3">
                    <Link href={href} className="block">
                      <LevelBadge level={deviation.level} size="sm" />
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={href} className="font-medium text-black hover:underline dark:text-zinc-50">
                      {deviation.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{projectName}</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                    {deviation.valueAtRisk > 0
                      ? `Rs ${deviation.valueAtRisk.toLocaleString("en-IN")}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-zinc-700 dark:text-zinc-300">
                    {deviation.priority.toFixed(1)}
                  </td>
                  <td className="px-4 py-3">
                    <TimeRemaining value={deviation.timeRemaining} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
