/**
 * ANUBANDH prototype addition — see plan.md/update (1).md TASK 1.
 *
 * A ScanScenario is a pre-authored playback of what a field scan would
 * produce — each one is a fixed record, not a live signature check. No
 * actual verification happens anywhere in this prototype; the gate-scan
 * screen just reveals these fields in stages.
 */

export interface ScanCheck {
  label: string;
  expected: string;
  found: string;
  pass: boolean;
}

/**
 * Fields for an invoice/e-way-bill style scan are all optional so the same
 * shape can instead carry an SBOM-style payload (project-4's deploy
 * checkpoint, TASK 9.5) — a scenario populates whichever set applies.
 */
export interface ScanPayload {
  sellerGstin?: string;
  sellerName?: string;
  buyerGstin?: string;
  docNo?: string;
  docDate?: string;
  totalValue?: string;
  itemCount?: string;
  mainHsn?: string;
  irn?: string;

  // ---- SBOM-shaped fields (deploy checkpoint) ----
  packageName?: string;
  packageVersion?: string;
  subprocessor?: string;
  dataResidency?: string;
  dependencyCount?: string;
  sbomHash?: string;
}

export interface ScanScenario {
  id: string;
  label: string;
  description: string;
  signatureValid: boolean;
  signatureNote: string;
  payload: ScanPayload;
  checks: ScanCheck[];
  resultGateEventId: string;
}
