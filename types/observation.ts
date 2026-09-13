/**
 * ANUBANDH prototype addition — see plan.md/update (1).md TASK 1.
 *
 * An Observation is a pre-authored playback of something an independent
 * source reported (a QR scan, a weighbridge reading, a bank payment...).
 * An Expectation is what a Commitment says should eventually show up as an
 * Observation. Both are 100% hand-authored display data — no verification
 * or matching logic runs anywhere in this prototype.
 */

export type ObservationSourceType =
  | "GST_IRN_QR"
  | "EWAY_BILL"
  | "WEIGHBRIDGE"
  | "GATE_CREDENTIAL"
  | "ATTENDANCE"
  | "EQUIPMENT_GPS"
  | "SITE_PHOTO"
  | "BANK_PAYMENT"
  | "GIT_COMMIT"
  | "SBOM"
  | "LAB_CERTIFICATE";

export interface Observation {
  id: string;
  projectId: string;
  sourceType: ObservationSourceType;
  sourceLabel: string;
  /** display string, e.g. "Government-signed, cannot be authored by the contractor" */
  trustLabel: string;
  /** 0-1, for display only (rendered as a badge/meter, never compared) */
  trustScore: number;
  observedValue: string;
  observedAt: string;
  /** hardcoded-looking hex string, purely cosmetic */
  hash: string;
}

export type ExpectationStatus = "PENDING" | "MET" | "MISSING";

export interface Expectation {
  id: string;
  commitmentId: string;
  expectedType: ObservationSourceType;
  expectedLabel: string;
  /** display string, e.g. "Within 7 days of pour" */
  dueLabel: string;
  /** display string, e.g. "6 days overdue", or null if not overdue */
  overdueLabel: string | null;
  status: ExpectationStatus;
}
