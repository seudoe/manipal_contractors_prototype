/**
 * spec: project_coding_spec.md section 5 (Projects) + section 6 (Project Stakeholders)
 * + section 26 (Core TypeScript Interfaces)
 *
 * NOTE: `status` is never enumerated in the spec — left as `string` for now.
 * `mainContractorId` must never be editable through a normal project update
 * endpoint (spec section 5 / 29) — see PATCH /api/projects/:projectId. It IS
 * nullable, though: a project can exist before it's been awarded to anyone
 * (see db/queries.ts#assignMainContractor). Once set, it's a one-time award,
 * not an ordinary edit — there's still no endpoint to change it afterwards.
 */

export type ProjectStatus = string;

export interface Project {
  id: string;
  name: string;
  description?: string;
  domain: string;
  status: ProjectStatus;

  ownerStakeholderId: string;
  /** the awarded main contractor — null until awarded, locked after that */
  mainContractorId: string | null;
  baselineVersionId?: string;

  contractValue: number;
  currency: string;

  originalStartDate?: string;
  originalCompletionDate?: string;
  currentExpectedCompletionDate?: string;

  createdAt: string;
  updatedAt: string;

  /**
   * NOT part of the spec's schema — a demo-only, display-purpose pointer
   * used when a contractor's own work has been spun out into a separate
   * hardcoded project record with no real relational link otherwise (e.g.
   * project-5 "Electrical & Signaling System" vs. its parent project-1).
   * Used for: (1) the "part of X" label in ProjectHeader, and (2) hiding
   * the parent project from that contractor's own project list in
   * getProjectsForUser, so they don't see the same work listed twice.
   */
  partOfProjectId?: string | null;
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
