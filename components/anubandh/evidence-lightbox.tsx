"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Observation } from "@/types/observation";
import { EvidencePhoto } from "./evidence-photo";
import { TrustNote } from "./trust-note";

/**
 * ANUBANDH — lightbox for a SITE_PHOTO observation (evidence viewer). Pass
 * an Observation and this renders both the clickable thumbnail and the
 * modal, keeping the open/close state local to each photo.
 */
export function EvidenceLightbox({ observation }: { observation: Observation }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="block text-left">
        <EvidencePhoto seed={observation.id} size="md" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex w-full max-w-lg flex-col gap-3 rounded-xl bg-white p-4 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-black dark:text-zinc-50">
                {observation.sourceLabel}
              </p>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <EvidencePhoto
              seed={observation.id}
              size="lg"
              caption={new Date(observation.observedAt).toLocaleString()}
            />

            <p className="text-sm text-zinc-700 dark:text-zinc-300">{observation.observedValue}</p>

            <TrustNote
              sourceType={observation.sourceType}
              trustLabel={observation.trustLabel}
              trustScore={observation.trustScore}
            />

            <p className="font-mono text-[11px] text-zinc-400">{observation.hash}</p>
          </div>
        </div>
      )}
    </>
  );
}
