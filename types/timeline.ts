/**
 * ANUBANDH prototype addition — the project timeline/activity feed.
 * A TimelineEntry is never authored directly; db/queries.ts#getProjectTimeline
 * merges existing observation/deviation/gate-event/override records into
 * this shape and sorts by their own existing timestamp field — the same
 * kind of plain sort the codebase already does elsewhere (e.g.
 * getProjectChanges sorting by createdAt). No value is computed or scored.
 */
export type TimelineEntryType = "OBSERVATION" | "DEVIATION" | "GATE_EVENT" | "OVERRIDE";

export interface TimelineEntry {
  id: string;
  type: TimelineEntryType;
  at: string;
  title: string;
  description: string;
  /** present for OBSERVATION entries whose source is a photo, so the feed can offer a thumbnail */
  isPhoto?: boolean;
  /** present for OBSERVATION entries — lets the feed render a trust badge inline */
  trustLabel?: string;
  trustScore?: number;
  /** present for DEVIATION / GATE_EVENT entries */
  level?: "L0" | "L1" | "L2" | "L3" | "L4";
  /** present for GATE_EVENT entries */
  decision?: "PASS" | "PASS_WITH_EVIDENCE" | "HOLD";
  href?: string;
}
