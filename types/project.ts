/**
 * spec: project_coding_spec.md section 5 (Projects) + section 6 (Project Stakeholders)
 * + section 26 (Core TypeScript Interfaces)
 *
 * NOTE: `status` is never enumerated in the spec — left as `string` for now.
 * `mainContractorId` must never be editable through a normal project update
 * endpoint (spec section 5 / 29) — see PATCH /api/projects/:projectId.
 */

export type ProjectStatus = string;

export interface Project {
  id: string;
  name: string;
  description?: string;
  domain: string;
  status: ProjectStatus;

  ownerStakeholderId: string;
  /** the awarded main contractor — locked after award, not normally editable */
  mainContractorId: string;
  baselineVersionId?: string;

  contractValue: number;
  currency: string;

  originalStartDate?: string;
  originalCompletionDate?: string;
  currentExpectedCompletionDate?: string;

  createdAt: string;
  updatedAt: string;
}

export type ProjectStakeholderRole = "OWNER" | "EDITOR" | "VIEWER";

export interface ProjectStakeholder {
  id: string;
  projectId: string;
  userId: string;
  /** only one stakeholder per project may hold OWNER */
  role: ProjectStakeholderRole;
  createdAt: string;
}
