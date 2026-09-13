import type { DeviationLevel } from "@/types/deviation";

/**
 * ANUBANDH shared primitive — renders a deviation level. L0/L1 read as
 * calm/informational, L2 as caution, L3/L4 as unmistakably urgent. Purely
 * presentational: the level itself is always a hand-authored field.
 */
const LEVEL_META: Record<
  DeviationLevel,
  { name: string; className: string }
> = {
  L0: {
    name: "Cosmetic",
    className: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  },
  L1: {
    name: "Minor",
    className: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  },
  L2: {
    name: "Material",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  L3: {
    name: "Critical",
    className: "bg-red-100 text-red-700 ring-1 ring-red-300 dark:bg-red-950 dark:text-red-300 dark:ring-red-800",
  },
  L4: {
    name: "Integrity",
    className:
      "bg-red-600 text-white ring-1 ring-red-700 dark:bg-red-700 dark:ring-red-500 animate-pulse",
  },
};

export function LevelBadge({
  level,
  size = "md",
}: {
  level: DeviationLevel;
  size?: "sm" | "md";
}) {
  const meta = LEVEL_META[level];
  const padding = size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${padding} ${meta.className}`}
    >
      <span className="font-mono">{level}</span>
      <span className="opacity-80">{meta.name}</span>
    </span>
  );
}
