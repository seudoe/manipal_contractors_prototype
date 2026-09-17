/**
 * 5 (dramatic) -> red, down through orange, to 1 (no real effect) landing
 * between yellow and green. A node untouched by the comparison (no entry
 * at all) is plain green — "no change."
 */
const SEVERITY_COLORS: Record<number, string> = {
  5: "#dc2626", // red-600
  4: "#ea580c", // orange-600
  3: "#f97316", // orange-500
  2: "#eab308", // yellow-500
  1: "#84cc16", // lime-500 — yellow-green, "no effect" but still technically a change
};

export const NO_CHANGE_COLOR = "#16a34a"; // green-600

export function severityColor(effect: number | undefined): string {
  if (!effect) return NO_CHANGE_COLOR;
  return SEVERITY_COLORS[effect] ?? NO_CHANGE_COLOR;
}
