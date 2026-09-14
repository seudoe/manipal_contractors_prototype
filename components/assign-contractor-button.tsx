"use client";

import { useState, useTransition } from "react";
import { Building2, X } from "lucide-react";
import { assignContractor } from "@/app/actions";

export interface AssignableContractor {
  id: string;
  name: string;
  description?: string;
}

export function AssignContractorButton({
  projectId,
  contractors,
}: {
  projectId: string;
  contractors: AssignableContractor[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handlePick(contractorId: string) {
    startTransition(async () => {
      await assignContractor(projectId, contractorId);
      setOpen(false);
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
      >
        <Building2 size={14} />
        Assign to Contractor
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-indigo-200 bg-white p-2 shadow-lg dark:border-indigo-800/50 dark:bg-slate-900">
            <div className="mb-1 flex items-center justify-between px-2 py-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Award to
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>

            {contractors.length === 0 ? (
              <p className="px-2 py-3 text-xs text-slate-500">
                No eligible contractors found.
              </p>
            ) : (
              <div className="flex flex-col gap-0.5">
                {contractors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    disabled={pending}
                    onClick={() => handlePick(c.id)}
                    className="flex w-full flex-col items-start rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
                  >
                    <span className="font-medium text-slate-900 dark:text-slate-50">
                      {c.name}
                    </span>
                    {c.description && (
                      <span className="text-xs text-slate-500">{c.description}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
