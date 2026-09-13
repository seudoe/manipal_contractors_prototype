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

  // project-3 is brand new — only the main contractor is on board so far, no subcontractor yet
  { id: "pc-5", projectId: "project-3", contractorId: "contractor-1", role: "MAIN_CONTRACTOR", createdAt: "2026-08-20T00:00:00.000Z" },

  // ANUBANDH addition (TASK 9)
  { id: "pc-6", projectId: "project-4", contractorId: "contractor-3", role: "MAIN_CONTRACTOR", createdAt: "2025-10-15T00:00:00.000Z" },
];
