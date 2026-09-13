import { CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import type { GateDecision, DeviationLevel } from "@/types/deviation";
import { TimeRemaining } from "./time-remaining";

/**
 * ANUBANDH shared primitive — the big gate verdict card. Three fixed
 * states read straight off a GateEvent record: PASS (green),
 * PASS_WITH_EVIDENCE labelled "Proof needed" (amber), HOLD (red, large —
 * this is the screen we demo).
 */
const DECISION_META: Record<
  GateDecision,
  { label: string; icon: typeof CheckCircle2; wrapClass: string; iconClass: string }
> = {
  PASS: {
    label: "PASS",
    icon: CheckCircle2,
    wrapClass:
      "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  PASS_WITH_EVIDENCE: {
    label: "Proof needed",
    icon: AlertTriangle,
    wrapClass: "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  HOLD: {
    label: "HOLD",
    icon: ShieldAlert,
    wrapClass:
      "border-red-400 bg-red-50 ring-4 ring-red-200 dark:border-red-700 dark:bg-red-950 dark:ring-red-900",
    iconClass: "text-red-600 dark:text-red-400",
  },
};

export function DecisionCard({
  decision,
  level,
  reasons,
  valueAtRisk,
  timeRemaining,
}: {
  decision: GateDecision;
  level: DeviationLevel;
  reasons: string[];
  valueAtRisk: number;
  timeRemaining: string;
}) {
  const meta = DECISION_META[decision];
  const Icon = meta.icon;
  const isHold = decision === "HOLD";

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border-2 p-6 ${meta.wrapClass} ${
        isHold ? "sm:p-10" : ""
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Icon size={isHold ? 48 : 32} className={meta.iconClass} strokeWidth={2} />
          <div>
            <p
              className={`font-extrabold tracking-tight ${meta.iconClass} ${
                isHold ? "text-4xl sm:text-5xl" : "text-2xl"
              }`}
            >
              {meta.label}
            </p>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Level {level}
            </p>
          </div>
        </div>
        <TimeRemaining value={timeRemaining} />
      </div>

      {valueAtRisk > 0 && (
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Value at risk:{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            Rs {valueAtRisk.toLocaleString("en-IN")}
          </span>
        </p>
      )}

      {reasons.length > 0 && (
        <ul className="flex flex-col gap-1.5 border-t border-indigo-200 pt-4 text-sm dark:border-indigo-800/40">
          {reasons.map((reason) => (
            <li key={reason} className="flex gap-2 text-slate-700 dark:text-slate-300">
              <span className="select-none text-slate-400">-</span>
              {reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
