import type { ProjectContractor } from "@/types/contractor";

/**
 * Links contractors to the projects they work on. The subcontractor
 * hierarchy itself lives on Contractor.parentContractorId, not here — this
 * table only records which contractors touch which project and in what role.
 */
export const projectContractors: ProjectContractor[] = [
  { id: "pc-1", projectId: "project-1", contractorId: "contractor-1", role: "MAIN_CONTRACTOR", createdAt: "2025-03-15T00:00:00.000Z" },
  { id: "pc-2", projectId: "project-1", contractorId: "contractor-2", role: "SUBCONTRACTOR", createdAt: "2025-03-20T00:00:00.000Z" },

  { id: "pc-3", projectId: "project-2", contractorId: "contractor-3", role: "MAIN_CONTRACTOR", createdAt: "2025-05-10T00:00:00.000Z" },
  { id: "pc-4", projectId: "project-2", contractorId: "contractor-4", role: "SUBCONTRACTOR", createdAt: "2025-05-18T00:00:00.000Z" },

  // project-3 has NOT been awarded yet — no MAIN_CONTRACTOR row until a
  // stakeholder uses "Assign to Contractor" (db/queries.ts#assignMainContractor
  // pushes one here at runtime, id `pc-assign-project-3-<contractorId>`).

  // ANUBANDH addition (TASK 9)
  { id: "pc-6", projectId: "project-4", contractorId: "contractor-3", role: "MAIN_CONTRACTOR", createdAt: "2025-10-15T00:00:00.000Z" },

  // project-5 — ElectroWorks is the MAIN_CONTRACTOR of its own standalone
  // "Electrical & Signaling System" project (not a subcontractor here).
  { id: "pc-7", projectId: "project-5", contractorId: "contractor-2", role: "MAIN_CONTRACTOR", createdAt: "2025-03-20T00:00:00.000Z" },
];
