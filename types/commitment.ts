/**
 * ANUBANDH prototype addition — see plan.md/update (1).md TASK 1.
 *
 * A Commitment is a plain-language restatement of one promise a contract
 * makes (a grade of steel, an identity, a colour) tied to a node in the
 * project graph. Everything here is display data, hand-authored in
 * db/commitments.ts — nothing is derived or computed.
 */

export type CommitmentCriticality =
  | "COSMETIC"
  | "FINANCIAL"
  | "IDENTITY"
  | "STRUCTURAL"
  | "SAFETY";

export type CommitmentToleranceBand = "NONE" | "TIGHT" | "LOOSE" | "COSMETIC";

export interface Commitment {
  id: string;
  projectId: string;
  nodeId: string;
  /** plain-language, for display — e.g. "Steel reinforcement must be Fe500 grade" */
  label: string;
  subject: string;
  predicate: string;
  promisedValue: string;
  sourceLabel: string;
  sourceRef: string;
  actorContractorId: string;
  criticality: CommitmentCriticality;
  toleranceBand: CommitmentToleranceBand;
  expectedEvidence: string[];
}

export type CommitmentCredentialStatus = "ACTIVE" | "REVOKED";

export interface CommitmentCredential {
  id: string;
  commitmentId: string;
  partyName: string;
  role: string;
  status: CommitmentCredentialStatus;
  issuedAt: string;
}
