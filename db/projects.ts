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
    mainContractorId: "contractor-1",
    baselineVersionId: "version-3-0",
    contractValue: 180_000_000,
    currency: "INR",
    originalStartDate: "2026-09-01",
    originalCompletionDate: "2028-02-28",
    currentExpectedCompletionDate: "2028-02-28",
    createdAt: "2026-08-20T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z",
  },
];
