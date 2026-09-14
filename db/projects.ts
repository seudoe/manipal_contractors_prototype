import type { Project } from "@/types/project";

/**
 * 3 projects. project-1 and project-2 have version/change history (see
 * db/versions.ts and db/changes.ts); project-3 is brand new — only a v0
 * baseline exists for it, no changes yet.
 */
export const projects: Project[] = [
  {
    id: "project-1",
    name: "Riverside Metro Extension",
    description:
      "Extension of the city metro line across the riverside corridor, including elevated track, three new stations, and depot upgrades.",
    domain: "Transit Infrastructure",
    status: "IN_PROGRESS",
    ownerStakeholderId: "user-st-1",
    mainContractorId: "contractor-1",
    baselineVersionId: "version-1-0",
    contractValue: 500_000_000,
    currency: "INR",
    originalStartDate: "2025-04-01",
    originalCompletionDate: "2027-03-31",
    currentExpectedCompletionDate: "2027-05-31",
    createdAt: "2025-03-15T00:00:00.000Z",
    updatedAt: "2026-02-05T00:00:00.000Z",
  },
  {
    id: "project-2",
    name: "Greenfield Hospital Complex",
    description:
      "Construction of a 400-bed multi-specialty hospital complex including OPD block, ICU wing, and medical equipment installation.",
    domain: "Healthcare Infrastructure",
    status: "IN_PROGRESS",
    ownerStakeholderId: "user-st-2",
    mainContractorId: "contractor-3",
    baselineVersionId: "version-2-0",
    contractValue: 335_000_000,
    currency: "INR",
    originalStartDate: "2025-06-01",
    originalCompletionDate: "2026-12-31",
    currentExpectedCompletionDate: "2026-12-31",
    createdAt: "2025-05-10T00:00:00.000Z",
    updatedAt: "2025-11-02T00:00:00.000Z",
  },
  {
    id: "project-3",
    name: "Smart Water Distribution Network",
    description:
      "City-wide smart water distribution network with IoT-enabled monitoring and a new primary pipeline corridor.",
    domain: "Utilities Infrastructure",
    status: "NOT_STARTED",
    ownerStakeholderId: "user-st-3",
    // Not awarded yet — this is the one demo project that's still
    // pre-award, so the stakeholder's "Assign to Contractor" button has
    // something to act on. See db/queries.ts#assignMainContractor.
    mainContractorId: null,
    baselineVersionId: "version-3-0",
    contractValue: 180_000_000,
    currency: "INR",
    originalStartDate: "2026-09-01",
    originalCompletionDate: "2028-02-28",
    currentExpectedCompletionDate: "2028-02-28",
    createdAt: "2026-08-20T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z",
  },

  // ---- ANUBANDH addition (TASK 9) — a software contract, so the same
  // screens can be demoed for both a construction and a software domain.
  {
    id: "project-4",
    name: "State Citizen Services Portal",
    description:
      "A citizen-facing e-governance portal covering identity, payments, and records access, with a phased production rollout.",
    domain: "Software / e-Governance",
    status: "IN_PROGRESS",
    ownerStakeholderId: "user-st-1",
    mainContractorId: "contractor-3",
    baselineVersionId: "version-4-0",
    contractValue: 92_000_000,
    currency: "INR",
    originalStartDate: "2025-11-01",
    originalCompletionDate: "2026-11-30",
    currentExpectedCompletionDate: "2026-11-30",
    createdAt: "2025-10-15T00:00:00.000Z",
    updatedAt: "2026-09-10T00:00:00.000Z",
  },

  // ---- Demo addition — ElectroWorks' "own" project, hardcoded to LOOK like
  // the Electrical & Signaling System work on project-1 (Riverside Metro
  // Extension) has been spun out as its own project for the subcontractor.
  // There is deliberately NO relational link at the graph/data level (no
  // shared node/edge ids, no cross-referencing) — it's the same
  // name/structure only. `partOfProjectId` is the one intentional exception:
  // a display-only pointer (see types/project.ts) so ElectroWorks' project
  // list shows this instead of project-1 (getProjectsForUser hides the
  // parent once its spin-off is in the same contractor's list), and its
  // header can say "part of Riverside Metro Extension".
  {
    id: "project-5",
    name: "Electrical & Signaling System",
    description:
      "Electrical and signaling systems package for the Riverside Metro Extension corridor, including traction power wiring and SCADA-based signaling integration.",
    domain: "Transit Infrastructure",
    status: "IN_PROGRESS",
    ownerStakeholderId: "user-st-1",
    mainContractorId: "contractor-2",
    baselineVersionId: "version-5-0",
    partOfProjectId: "project-1",
    contractValue: 45_000_000,
    currency: "INR",
    originalStartDate: "2025-03-20",
    originalCompletionDate: "2026-11-01",
    currentExpectedCompletionDate: "2026-11-01",
    createdAt: "2025-03-20T00:00:00.000Z",
    updatedAt: "2025-09-10T00:00:00.000Z",
  },
];
