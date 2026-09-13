import { getAllOverrides } from "@/db/queries";

export default function Page() {
  const overrides = getAllOverrides();

  const countsByOfficer = new Map<string, number>();
  for (const o of overrides) {
    countsByOfficer.set(o.officerName, (countsByOfficer.get(o.officerName) ?? 0) + 1);
  }
  const rows = [...countsByOfficer.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-black dark:text-zinc-50">Override Audit</h1>
        <p className="max-w-2xl text-sm text-zinc-500">
          If you only monitor contractors, the override becomes the new fraud channel — this
          screen exists so an officer overriding gate decisions is watched as closely as the
          contractors those gates were built to check.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-black/10 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-400 dark:border-white/10 dark:bg-zinc-900">
              <th className="px-4 py-2 font-medium">Officer</th>
              <th className="px-4 py-2 font-medium">Override count</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([officer, count]) => (
              <tr key={officer} className="border-b border-black/5 last:border-0 dark:border-white/5">
                <td className="px-4 py-3 font-medium text-black dark:text-zinc-50">{officer}</td>
                <td className="px-4 py-3 font-mono text-zinc-700 dark:text-zinc-300">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
        Chain intact
      </span>
    </div>
  );
}
