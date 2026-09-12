/**
 * spec: project_coding_spec.md section 15 (Version Control) + section 16 (Changes)
 * + section 17 (Change Review) + section 23 (Review Priority) + section 26
 */

/** append-only — v0 is the original baseline */
export interface ProjectVersion {
  id: string;
  projectId: string;
  versionNumber: number;
  parentVersionId?: string | null;
  createdBy: string;
  createdAt: string;
  message?: string;
}

export type ChangeType =
  | "NODE_CREATED"
  | "NODE_DELETED"
  | "NODE_UPDATED"
  | "EDGE_CREATED"
  | "EDGE_DELETED"
  | "CONTRACTOR_ASSIGNED"
  | "SUBCONTRACTOR_CHANGED"
  | "BUDGET_CHANGED"
  | "TIMELINE_CHANGED"
  | "STATUS_CHANGED"
  | "PROGRESS_CHANGED";

export type ProjectChangeStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "NEEDS_EVIDENCE";

/** the old state must never be lost — see section 40 (Change Submission Flow) */
export interface ProjectChange {
  id: string;
  projectId: string;
  versionId: string;

  nodeId?: string;

  changeType: ChangeType;

  field?: string;
  oldValue?: unknown;
  newValue?: unknown;

  reason?: string;

  createdBy: string;
  createdAt: string;

  status: ProjectChangeStatus;
}

export type ChangeReviewDecision =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "NEEDS_EVIDENCE";

/** contractor submits a change; stakeholder/inspector review it */
export interface ChangeReview {
  id: string;
  changeId: string;
  reviewerId: string;
  decision: ChangeReviewDecision;
  comment?: string;
  reviewedAt: string;
}

export type ChangeRiskPriority = "LOW" | "MEDIUM" | "HIGH";

/**
 * Stored rather than calculated only on the frontend (section 23).
 * The score is an attention indicator, not a fraud verdict.
 */
export interface ChangeRiskScore {
  id: string;
  changeId: string;
  score: number;
  priority: ChangeRiskPriority;
  reasons: string[];
  calculatedAt: string;
}
