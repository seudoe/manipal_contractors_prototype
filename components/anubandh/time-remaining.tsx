/**
 * ANUBANDH shared primitive — displays a hand-authored timeRemaining string
 * with an urgency colour ramp derived purely from the string's contents
 * (no date math, no parsing into real time values).
 */
function urgencyClassFor(timeRemaining: string): string {
  const t = timeRemaining.toLowerCase();
  if (t === "passed") {
    return "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500";
  }
  if (t.includes("m") && !t.includes("d") && !t.includes("h")) {
    // pure minutes, e.g. "45m"
    return "bg-red-600 text-white";
  }
  if (t.includes("h")) {
    const hoursMatch = t.match(/(\d+)h/);
    const hours = hoursMatch ? Number(hoursMatch[1]) : 99;
    if (hours < 4) return "bg-red-600 text-white";
    if (hours < 12) return "bg-amber-500 text-white";
    return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
  }
  if (t.includes("d")) {
    return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  }
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
}

export function TimeRemaining({ value }: { value: string }) {
  return (
    <span
      className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${urgencyClassFor(
        value
      )}`}
    >
      {value === "passed" ? "Passed" : value}
    </span>
  );
}
