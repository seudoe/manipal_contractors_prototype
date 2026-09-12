/**
 * spec: project_coding_spec.md section 7 (Contractors) + section 8 (Contractor <-> Project)
 * + section 13 (Feature <-> Contractor Assignment) + section 26 (Core TypeScript Interfaces)
 *
 * A subcontractor is NOT a separate role/table — it's a Contractor row with
 * `parentContractorId` pointing at its parent (section 3).
 */

export interface Contractor {
  id: string;
  userId: string;
  name: string;
  description?: string;
  /** null for the main (awarded) contractor; otherwise the contractor one level up */
  parentContractorId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ProjectContractorRole = "MAIN_CONTRACTOR" | "SUBCONTRACTOR";

/**
 * Links a contractor to a project. The actual subcontractor hierarchy is
 * determined by Contractor.parentContractorId, not by this table.
 */
export interface ProjectContractor {
  id: string;
  projectId: string;
  contractorId: string;
  role: ProjectContractorRole;
  createdAt: string;
}

export type FeatureAssignmentType = "RESPONSIBLE" | "SUBCONTRACTED";

/**
 * Assigns responsibility for a project graph node (feature) to a contractor.
 * The project graph itself remains feature-only — this table is what answers
 * "which features is this contractor responsible for?"
 */
export interface FeatureAssignment {
  id: string;
  projectId: string;
  nodeId: string;
  contractorId: string;
  assignmentType: FeatureAssignmentType;
  createdAt: string;
}
