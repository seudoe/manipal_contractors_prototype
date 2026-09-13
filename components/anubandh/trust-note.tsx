import type { Observation } from "@/types/observation";
import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";

/**
 * ANUBANDH shared primitive — a short badge plus one line explaining how
 * independent an observation's source is. trustLabel/trustScore are always
 * read off the record, never computed.
 */
function iconFor(trustScore: number) {
  if (trustScore >= 0.85) return ShieldCheck;
  if (trustScore >= 0.5) return ShieldQuestion;
  return ShieldAlert;
}

function toneFor(trustScore: number): string {
  if (trustScore >= 0.85) return "text-emerald-600 dark:text-emerald-400";
  if (trustScore >= 0.5) return "text-amber-600 dark:text-amber-400";
  return "text-slate-500";
}

export function TrustNote({
  sourceType,
  trustLabel,
  trustScore,
}: Pick<Observation, "sourceType" | "trustLabel" | "trustScore">) {
  const Icon = iconFor(trustScore);
  return (
    <div className="flex items-start gap-2 rounded-lg border border-indigo-200 bg-slate-50 p-3 text-sm dark:border-indigo-800/40 dark:bg-slate-900">
      <Icon size={18} className={`mt-0.5 shrink-0 ${toneFor(trustScore)}`} />
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-50">
          {sourceType.replaceAll("_", " ")}
        </p>
        <p className="text-xs text-slate-500">{trustLabel}</p>
      </div>
    </div>
  );
}
