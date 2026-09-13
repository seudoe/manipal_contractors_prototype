"use client";

import { useState } from "react";
import { CheckCircle2, Megaphone } from "lucide-react";

/**
 * ANUBANDH — inert citizen concern form (TASK 10.2). Submitting shows a
 * success state but writes nothing anywhere; a case can only ever be
 * opened by this, never closed.
 */
export function ReportConcernForm() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
        <CheckCircle2 size={16} />
        Thank you — your report has been noted (demo only, nothing was recorded).
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-800/40 dark:bg-slate-900">
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
        <Megaphone size={16} /> Report a concern
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe what you observed..."
        rows={3}
        className="rounded-lg border border-indigo-200 bg-transparent p-2 text-sm dark:border-indigo-800/40"
      />
      <p className="text-xs text-slate-500">
        A citizen report can open a case but never close one.
      </p>
      <button
        disabled={!text.trim()}
        onClick={() => setSubmitted(true)}
        className="self-start rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400"
      >
        Submit
      </button>
    </div>
  );
}
