/**
 * ANUBANDH prototype addition — see plan.md/update (1).md TASK 1.
 *
 * A Deviation is the gap between a Commitment's promise and what was
 * observed (or never observed — "SILENCE"). A GateEvent is the checkpoint
 * decision that resulted. Every level, priority, timeRemaining string and
 * reason here is hand-authored in db/deviations.ts / db/gate-events.ts —
 * nothing in this prototype computes a severity, a priority, or a countdown.
 */

export type DeviationLevel = "L0" | "L1" | "L2" | "L3" | "L4";

export type DeviationKind = "MISMATCH" | "SILENCE" | "PROMOTED";

export type DeviationStatus = "OPEN" | "EVIDENCE_REQUESTED" | "CLOSED";

export interface PriorityFactor {
  label: string;
  value: string;
}

export interface Deviation {
  id: string;
  projectId: string;
  commitmentId: string;
  observationId: string | null;
  expectationId: string | null;
  kind: DeviationKind;
  level: DeviationLevel;
  title: string;
  promisedText: string;
  observedText: string;
  reasons: string[];
  valueAtRisk: number;
  /** hardcoded number — never computed */
  priority: number;
  /** display string, e.g. "3h 49m" or "passed" */
  timeRemaining: string;
  /** purely presentational breakdown shown in priority-panel.tsx */
  priorityFactors: PriorityFactor[];
  /** for kind === "PROMOTED": the small deviations rolled up into this one */
  contributingDeviationIds: string[];
  cumulativeValue: number | null;
  status: DeviationStatus;
  raisedAt: string;
}

export type GateDecision = "PASS" | "PASS_WITH_EVIDENCE" | "HOLD";

export interface GateEvent {
  id: string;
  projectId: string;
  nodeId: string;
  checkpointLabel: string;
  decision: GateDecision;
  level: DeviationLevel;
  reasons: string[];
  valueAtRisk: number;
  timeRemaining: string;
  at: string;
  overrideId: string | null;
}

export interface Override {
  id: string;
  gateEventId: string;
  officerName: string;
  reason: string;
  at: string;
  /** hardcoded-looking hex string, purely cosmetic — no real chain */
  hash: string;
  prevHash: string;
}
