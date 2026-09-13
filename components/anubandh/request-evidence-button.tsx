"use client";

import { useState } from "react";
import { FileSearch, CheckCircle2 } from "lucide-react";

/**
 * ANUBANDH — deliberately inert. Clicking this shows a success toast but
 * never mutates db/deviations.ts or anything else. Forms/buttons are inert
 * by default per the prototype brief unless a task says otherwise.
 */
export function RequestEvidenceButton() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
        <CheckCircle2 size={16} />
        Evidence request sent (demo only — nothing was actually recorded)
      </div>
    );
  }

  return (
    <button
      onClick={() => setSent(true)}
      className="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
    >
      <FileSearch size={16} />
      Request evidence
    </button>
  );
}
