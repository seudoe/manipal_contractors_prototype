import type { ProjectFinancial } from "@/db/financial";
import { Check, X } from "lucide-react";

/**
 * ANUBANDH — renders the money view from a hand-authored ProjectFinancial
 * record. Every number here (claimGap, curves, CPI, cost-to-complete,
 * triple-entry rows) is read straight off the record; the SVG line chart is
 * hand-written from the two point arrays, no charting library.
 */
function buildPath(points: { month: string; value: number }[], width: number, height: number): string {
  if (points.length === 0) return "";
  const max = 100;
  const stepX = width / (points.length - 1 || 1);
  return points
    .map((p, i) => {
      const x = i * stepX;
      const y = height - (p.value / max) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function FinancialView({ financial, readOnly = false }: { financial: ProjectFinancial; readOnly?: boolean }) {
  const width = 480;
  const height = 160;
  const claimedPath = buildPath(financial.claimedCurve, width, height);
  const observedPath = buildPath(financial.observedCurve, width, height);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Claim gap</p>
        <p className="mt-1 text-4xl font-extrabold text-black dark:text-white">
          {financial.claimGap} points
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Claimed <span className="font-semibold text-black dark:text-zinc-50">{financial.claimedPercent}%</span>{" "}
          vs. observed{" "}
          <span className="font-semibold text-black dark:text-zinc-50">{financial.observedPercent}%</span>
        </p>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Claimed vs. observed progress
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Claimed
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Observed
            </span>
          </div>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="h-40 w-full">
          <path d={claimedPath} fill="none" stroke="#f59e0b" strokeWidth={2.5} />
          <path d={observedPath} fill="none" stroke="#10b981" strokeWidth={2.5} />
        </svg>
        <div className="mt-1 flex justify-between text-[10px] text-zinc-400">
          {financial.claimedCurve.map((p) => (
            <span key={p.month}>{p.month}</span>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Triple-entry ledger
        </p>
        <p className="mb-2 text-xs text-zinc-500">
          These figures come from observed inputs — weighbridge, GPS, gate and photo evidence —
          rather than from a filed progress claim.
        </p>
        <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-400 dark:border-white/10 dark:bg-zinc-900">
                <th className="px-4 py-2 font-medium">Period</th>
                <th className="px-4 py-2 font-medium">Money</th>
                <th className="px-4 py-2 font-medium">Material</th>
                <th className="px-4 py-2 font-medium">Work</th>
                <th className="px-4 py-2 font-medium">Pattern</th>
                <th className="px-4 py-2 font-medium">Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {financial.tripleEntry.map((row) => (
                <tr
                  key={row.period}
                  className={`border-b border-black/5 last:border-0 dark:border-white/5 ${
                    row.flagged ? "bg-red-50 dark:bg-red-950/40" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-black dark:text-zinc-50">{row.period}</td>
                  <td className="px-4 py-3">{row.money ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-red-500" />}</td>
                  <td className="px-4 py-3">{row.material ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-red-500" />}</td>
                  <td className="px-4 py-3">{row.work ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-red-500" />}</td>
                  <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">{row.pattern}</td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{row.interpretation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:w-80">
        <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500">CPI</p>
          <p className="mt-0.5 text-lg font-semibold text-black dark:text-zinc-50">{financial.cpi.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500">Cost to complete</p>
          <p className="mt-0.5 text-lg font-semibold text-black dark:text-zinc-50">
            Rs {financial.costToComplete.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {readOnly && (
        <p className="text-xs text-zinc-400">Read-only view.</p>
      )}
    </div>
  );
}
