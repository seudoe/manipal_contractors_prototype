"use client";

import { useState } from "react";
import type { Commitment, CommitmentCriticality, CommitmentToleranceBand } from "@/types/commitment";

const CRITICALITIES: CommitmentCriticality[] = ["COSMETIC", "FINANCIAL", "IDENTITY", "STRUCTURAL", "SAFETY"];
const TOLERANCES: CommitmentToleranceBand[] = ["NONE", "TIGHT", "LOOSE", "COSMETIC"];

/**
 * ANUBANDH — award-time commitment review (TASK 10.1). The selects LOOK
 * editable but are deliberately inert: local component state only, never
 * written back to db/commitments.ts. This is the one screen where a human
 * is meant to configure the system — it takes about ten minutes per
 * contract — everything downstream just reads whatever was set here.
 */
export function CommitmentReviewTable({ commitments }: { commitments: Commitment[] }) {
  const [overrides, setOverrides] = useState<Record<string, { criticality: CommitmentCriticality; toleranceBand: CommitmentToleranceBand }>>({});

  return (
    <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-black/10 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-400 dark:border-white/10 dark:bg-zinc-900">
            <th className="px-4 py-2 font-medium">Commitment</th>
            <th className="px-4 py-2 font-medium">Promised value</th>
            <th className="px-4 py-2 font-medium">Criticality</th>
            <th className="px-4 py-2 font-medium">Tolerance band</th>
          </tr>
        </thead>
        <tbody>
          {commitments.map((c) => {
            const current = overrides[c.id] ?? { criticality: c.criticality, toleranceBand: c.toleranceBand };
            return (
              <tr key={c.id} className="border-b border-black/5 last:border-0 dark:border-white/5">
                <td className="px-4 py-3 font-medium text-black dark:text-zinc-50">{c.label}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{c.promisedValue}</td>
                <td className="px-4 py-3">
                  {/* Inert: local state only, never written to db/commitments.ts */}
                  <select
                    value={current.criticality}
                    onChange={(e) =>
                      setOverrides((prev) => ({
                        ...prev,
                        [c.id]: { ...current, criticality: e.target.value as CommitmentCriticality },
                      }))
                    }
                    className="rounded-md border border-black/10 bg-transparent px-2 py-1 text-xs dark:border-white/10"
                  >
                    {CRITICALITIES.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  {/* Inert: local state only, never written to db/commitments.ts */}
                  <select
                    value={current.toleranceBand}
                    onChange={(e) =>
                      setOverrides((prev) => ({
                        ...prev,
                        [c.id]: { ...current, toleranceBand: e.target.value as CommitmentToleranceBand },
                      }))
                    }
                    className="rounded-md border border-black/10 bg-transparent px-2 py-1 text-xs dark:border-white/10"
                  >
                    {TOLERANCES.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
