/**
 * spec: project_coding_spec.md section 19 (Daily Reports) + section 20 (Report Fields)
 * + section 21 (Status Request)
 */

import type { GraphNodeStatus } from "./graph";

export type DailyReportStatus = "DRAFT" | "SUBMITTED" | "REVIEWED";

export interface DailyReport {
  id: string;
  projectId: string;
  submittedBy: string;
  reportDate: string;

  summary?: string;
  progress?: number;
  currentCost?: number;
  expectedCompletionDate?: string;
  issues?: string;
  nextSteps?: string;

  status: DailyReportStatus;

  createdAt: string;
  updatedAt: string;
}

/** per-feature breakdown of progress within a single daily report */
export interface DailyReportFeature {
  id: string;
  reportId: string;
  nodeId: string;
  progress: number;
  status: GraphNodeStatus;
  notes?: string;
}

/** links evidence rows to a daily report */
export interface DailyReportEvidence {
  id: string;
  reportId: string;
  evidenceId: string;
}

export type StatusRequestStatus = "PENDING" | "SUBMITTED" | "CLOSED";

/**
 * Stakeholder requests an update; contractor responds with a report/evidence.
 * `nodeId` is nullable — a request can be project-wide rather than feature-specific.
 */
export interface StatusRequest {
  id: string;
  projectId: string;
  nodeId?: string | null;
  requestedBy: string;
  assignedTo: string;
  message?: string;
  status: StatusRequestStatus;
  createdAt: string;
  respondedAt?: string;
}
