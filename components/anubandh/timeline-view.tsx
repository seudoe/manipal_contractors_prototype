"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, AlertTriangle, ShieldAlert, Gavel, Camera } from "lucide-react";
import type { TimelineEntry, TimelineEntryType } from "@/types/timeline";
import { LevelBadge } from "./level-badge";
import { EvidencePhoto } from "./evidence-photo";

const TYPE_META: Record<TimelineEntryType, { label: string; icon: typeof Eye; className: string }> = {
  OBSERVATION: { label: "Observation", icon: Eye, className: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
  DEVIATION: { label: "Deviation", icon: AlertTriangle, className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
  GATE_EVENT: { label: "Gate event", icon: ShieldAlert, className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
  OVERRIDE: { label: "Override", icon: Gavel, className: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
};

const ALL_TYPES: TimelineEntryType[] = ["OBSERVATION", "DEVIATION", "GATE_EVENT", "OVERRIDE"];

/**
 * ANUBANDH — chronological activity feed merging observations, deviations,
 * gate events and overrides (TASK: timeline/activity feed). Rows arrive
 * pre-sorted by getProjectTimeline; this component only applies DISPLAY
 * filtering by type, the same pattern deviation-queue-view.tsx already uses.
 */
export function TimelineView({ entries }: { entries: TimelineEntry[] }) {
  const [activeTypes, setActiveTypes] = useState<Set<TimelineEntryType>>(new Set(ALL_TYPES));

  function toggle(type: TimelineEntryType) {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  const filtered = entries.filter((e) => activeTypes.has(e.type));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-indigo-200 bg-white p-3 dark:border-indigo-800/40 dark:bg-slate-900">
        {ALL_TYPES.map((type) => {
          const meta = TYPE_META[type];
          const Icon = meta.icon;
          const active = activeTypes.has(type);
          return (
            <button
              key={type}
              onClick={() => toggle(type)}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                active
                  ? "border-black/20 bg-slate-100 text-slate-900 dark:border-white/20 dark:bg-slate-800 dark:text-slate-50"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon size={13} />
              {meta.label}
            </button>
          );
        })}
      </div>

      <ol className="relative flex flex-col gap-4 border-l border-indigo-200 pl-6 dark:border-indigo-800/40">
        {filtered.map((entry) => {
          const meta = TYPE_META[entry.type];
          const Icon = meta.icon;
          return (
            <li key={entry.id} className="relative">
              <span
                className={`absolute -left-[29px] flex h-6 w-6 items-center justify-center rounded-full ${meta.className}`}
              >
                <Icon size={13} />
              </span>
              <div className="flex flex-col gap-1 rounded-xl border border-indigo-200 bg-white p-3 dark:border-indigo-800/40 dark:bg-slate-900">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-slate-400">
                    {new Date(entry.at).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {entry.level && <LevelBadge level={entry.level} size="sm" />}
                    {entry.decision && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {entry.decision === "PASS_WITH_EVIDENCE" ? "Proof needed" : entry.decision}
                      </span>
                    )}
                  </div>
                </div>
                {entry.href ? (
                  <Link href={entry.href} className="font-medium text-slate-900 hover:underline dark:text-slate-50">
                    {entry.title}
                  </Link>
                ) : (
                  <p className="font-medium text-slate-900 dark:text-slate-50">{entry.title}</p>
                )}
                <p className="text-xs text-slate-500">{entry.description}</p>
                {entry.isPhoto && (
                  <div className="mt-1 flex items-center gap-2">
                    <EvidencePhoto seed={entry.id} size="sm" />
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Camera size={11} /> Photo evidence attached
                    </span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
