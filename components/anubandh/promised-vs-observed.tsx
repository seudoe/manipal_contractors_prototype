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
      <div className="rounded-lg border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-zinc-900">
        <p className="text-xs font-medium text-zinc-400">{promisedLabel}</p>
        <p className="mt-1 text-sm font-medium text-black dark:text-zinc-50">{promisedText}</p>
      </div>

      <ArrowRight size={18} className="mx-auto hidden text-zinc-300 sm:block" />

      {silence ? (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900/50">
          <CircleOff size={18} className="shrink-0 text-zinc-400" />
          <div>
            <p className="text-xs font-medium text-zinc-400">{observedLabel}</p>
            <p className="mt-1 text-sm font-medium text-zinc-500">
              Expected evidence never arrived
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-400">{observedLabel}</p>
          <p className="mt-1 text-sm font-medium text-black dark:text-zinc-50">{observedText}</p>
        </div>
      )}
    </div>
  );
}
