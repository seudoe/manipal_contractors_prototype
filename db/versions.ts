import type { ProjectVersion } from "@/types/change";

/**
 * project-1 and project-2 have history (v0 -> v1 -> ...); project-3 is new
 * and only has its v0 baseline.
 */
export const versions: ProjectVersion[] = [
  { id: "version-1-0", projectId: "project-1", versionNumber: 0, parentVersionId: null, createdBy: "user-st-1", createdAt: "2025-03-15T00:00:00.000Z", message: "Baseline" },
  { id: "version-1-1", projectId: "project-1", versionNumber: 1, parentVersionId: "version-1-0", createdBy: "user-ct-1", createdAt: "2025-09-10T00:00:00.000Z", message: "Wiring subcontractor confirmed as ElectroWorks" },
  { id: "version-1-2", projectId: "project-1", versionNumber: 2, parentVersionId: "version-1-1", createdBy: "user-ct-1", createdAt: "2026-02-05T00:00:00.000Z", message: "Elevated track structure timeline revised; reinforcement budget proposed" },

  { id: "version-2-0", projectId: "project-2", versionNumber: 0, parentVersionId: null, createdBy: "user-st-2", createdAt: "2025-05-10T00:00:00.000Z", message: "Baseline" },
  { id: "version-2-1", projectId: "project-2", versionNumber: 1, parentVersionId: "version-2-0", createdBy: "user-ct-3", createdAt: "2025-11-02T00:00:00.000Z", message: "Medical equipment budget revised; plumbing works started" },

  { id: "version-3-0", projectId: "project-3", versionNumber: 0, parentVersionId: null, createdBy: "user-st-3", createdAt: "2026-08-20T00:00:00.000Z", message: "Baseline" },

  { id: "version-5-0", projectId: "project-5", versionNumber: 0, parentVersionId: null, createdBy: "user-ct-2", createdAt: "2025-03-20T00:00:00.000Z", message: "Baseline" },
];
