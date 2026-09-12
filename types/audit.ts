/**
 * spec: project_coding_spec.md section 24 (Audit Log)
 *
 * Separate from the user-facing version history (ProjectVersion/ProjectChange) —
 * this is a stricter audit trail for sensitive actions.
 */

export type AuditLogAction =
  | "PROJECT_CREATED"
  | "NODE_UPDATED"
  | "EDGE_CREATED"
  | "SUBCONTRACTOR_CHANGED"
  | "CHANGE_APPROVED"
  | "CHANGE_REJECTED"
  | "EVIDENCE_UPLOADED"
  | "REPORT_SUBMITTED";

export interface AuditLog {
  id: string;
  projectId: string;
  actorId: string;
  /** the spec's example list isn't exhaustive — kept open via `| string` */
  action: AuditLogAction | (string & {});
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  createdAt: string;
  ipAddress?: string | null;
}
