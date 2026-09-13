"use client";

import { useState } from "react";
import { AlertOctagon, ShieldCheck } from "lucide-react";

/**
 * ANUBANDH — the override confirmation flow. Deliberately inert: submitting
 * shows a pre-authored chain entry (already-known officer name, a
 * client-side timestamp, the typed reason, and a hardcoded-looking hash)
 * but never mutates db/overrides.ts.
 */
export function OverrideConfirm({ officerName }: { officerName: string }) {
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState<{ at: string; hash: string } | null>(null);

  if (confirmed) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
          <ShieldCheck size={20} />
          <p className="font-semibold">Override recorded</p>
        </div>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-slate-500">Officer</dt>
          <dd className="text-right font-medium text-slate-900 dark:text-slate-50">{officerName}</dd>
          <dt className="text-slate-500">Timestamp</dt>
          <dd className="text-right font-medium text-slate-900 dark:text-slate-50">{confirmed.at}</dd>
          <dt className="text-slate-500">Reason</dt>
          <dd className="text-right font-medium text-slate-900 dark:text-slate-50">{reason}</dd>
          <dt className="text-slate-500">Chain hash</dt>
          <dd className="text-right font-mono text-xs text-slate-600 dark:text-slate-300">
            {confirmed.hash}
          </dd>
        </dl>
        <p className="text-xs text-slate-500">
          Demo only — this confirmation is not written to db/overrides.ts.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
        <AlertOctagon size={18} className="mt-0.5 shrink-0" />
        <p>
          This override will be permanently recorded against <strong>{officerName}</strong> by
          name and cannot be removed.
        </p>
      </div>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason for overriding this gate decision..."
        rows={3}
        className="rounded-lg border border-indigo-200 bg-white p-3 text-sm dark:border-indigo-800/40 dark:bg-slate-900"
      />
      <button
        disabled={!reason.trim()}
        onClick={() =>
          setConfirmed({
            at: new Date().toISOString(),
            // hardcoded-looking hex string for display only — no real hash chain
            hash: "e3f7a1c9d5b2086ae3f7a1c9d5b2086a",
          })
        }
        className="self-start rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Confirm override
      </button>
    </div>
  );
}
