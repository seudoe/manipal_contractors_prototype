import { ArrowRight, CircleOff } from "lucide-react";

/**
 * ANUBANDH shared primitive — a two-column promised/observed comparison.
 * When `silence` is set, the observed column reads "Expected evidence never
 * arrived" instead of a value — used for kind === "SILENCE" deviations.
 */
export function PromisedVsObserved({
  promisedLabel = "Promised",
  observedLabel = "Observed",
  promisedText,
  observedText,
  silence = false,
}: {
  promisedLabel?: string;
  observedLabel?: string;
  promisedText: string;
  observedText: string;
  silence?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      <div className="rounded-lg border border-indigo-200 bg-white p-3 dark:border-indigo-800/40 dark:bg-slate-900">
        <p className="text-xs font-medium text-slate-400">{promisedLabel}</p>
        <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-50">{promisedText}</p>
      </div>

      <ArrowRight size={18} className="mx-auto hidden text-slate-300 sm:block" />

      {silence ? (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
          <CircleOff size={18} className="shrink-0 text-slate-400" />
          <div>
            <p className="text-xs font-medium text-slate-400">{observedLabel}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Expected evidence never arrived
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-indigo-200 bg-white p-3 dark:border-indigo-800/40 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-400">{observedLabel}</p>
          <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-50">{observedText}</p>
        </div>
      )}
    </div>
  );
}
