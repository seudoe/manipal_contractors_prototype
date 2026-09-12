import type { ProjectChange, ChangeReview, ChangeRiskScore } from "@/types/change";

/**
 * Change history for project-1 (3 changes, one still PENDING review) and
 * project-2 (2 changes, both approved). project-3 has no changes — it's new.
 */
export const changes: ProjectChange[] = [
  {
    id: "change-1",
    projectId: "project-1",
    versionId: "version-1-1",
    nodeId: "node-1-wiring",
    changeType: "SUBCONTRACTOR_CHANGED",
    field: "contractorId",
    oldValue: "contractor-legacy-cableworks",
    newValue: "contractor-2",
    reason: "Original subcontractor (CableWorks) could not meet the revised delivery schedule.",
    createdBy: "user-ct-1",
    createdAt: "2025-09-10T00:00:00.000Z",
    status: "APPROVED",
  },
  {
    id: "change-2",
    projectId: "project-1",
    versionId: "version-1-2",
    nodeId: "node-1-structure",
    changeType: "TIMELINE_CHANGED",
    field: "shouldCompleteBy",
    oldValue: "2027-01-31",
    newValue: "2027-04-15",
    reason: "Precast segment delivery delayed due to supplier capacity constraints.",
    createdBy: "user-ct-1",
    createdAt: "2026-01-20T00:00:00.000Z",
    status: "APPROVED",
  },
  {
    id: "change-3",
    projectId: "project-1",
    versionId: "version-1-2",
    changeType: "BUDGET_CHANGED",
    field: "contractValue",
    oldValue: 500_000_000,
    newValue: 650_000_000,
    reason: "Additional structural reinforcement required after updated soil survey.",
    createdBy: "user-ct-1",
    createdAt: "2026-02-05T00:00:00.000Z",
    status: "PENDING",
  },

  {
    id: "change-4",
    projectId: "project-2",
    versionId: "version-2-1",
    nodeId: "node-2-medequip",
    changeType: "BUDGET_CHANGED",
    field: "contractValue",
    oldValue: 320_000_000,
    newValue: 335_000_000,
    reason: "Additional imaging equipment (MRI suite) added to scope.",
    createdBy: "user-ct-3",
    createdAt: "2025-11-02T00:00:00.000Z",
    status: "APPROVED",
  },
  {
    id: "change-5",
    projectId: "project-2",
    versionId: "version-2-1",
    nodeId: "node-2-water",
    changeType: "STATUS_CHANGED",
    field: "status",
    oldValue: "NOT_STARTED",
    newValue: "IN_PROGRESS",
    reason: "Plumbing subcontractor mobilized on site.",
    createdBy: "user-ct-4",
    createdAt: "2025-10-15T00:00:00.000Z",
    status: "APPROVED",
  },
];

/** change-3 has no review yet — it's still PENDING. */
export const changeReviews: ChangeReview[] = [
  { id: "cr-1", changeId: "change-1", reviewerId: "user-st-1", decision: "APPROVED", comment: "Approved — ElectroWorks has a strong track record on similar transit projects.", reviewedAt: "2025-09-12T00:00:00.000Z" },
  { id: "cr-2", changeId: "change-2", reviewerId: "user-st-1", decision: "APPROVED", comment: "Acceptable delay given supplier constraints; monitor closely.", reviewedAt: "2026-01-22T00:00:00.000Z" },
  { id: "cr-3", changeId: "change-4", reviewerId: "user-st-2", decision: "APPROVED", comment: "Approved — MRI suite addition aligns with department request.", reviewedAt: "2025-11-05T00:00:00.000Z" },
  { id: "cr-4", changeId: "change-5", reviewerId: "user-st-2", decision: "APPROVED", comment: "Noted.", reviewedAt: "2025-10-16T00:00:00.000Z" },
];

export const changeRiskScores: ChangeRiskScore[] = [
  { id: "crs-1", changeId: "change-1", score: 25, priority: "LOW", reasons: ["Subcontractor changed"], calculatedAt: "2025-09-10T00:05:00.000Z" },
  { id: "crs-2", changeId: "change-2", score: 10, priority: "LOW", reasons: ["Timeline extended by under 6 months — routine"], calculatedAt: "2026-01-20T00:05:00.000Z" },
  { id: "crs-3", changeId: "change-3", score: 55, priority: "MEDIUM", reasons: ["Budget increased by 30%", "Structural scope expanded", "Supporting evidence pending"], calculatedAt: "2026-02-05T00:05:00.000Z" },
  { id: "crs-4", changeId: "change-4", score: 15, priority: "LOW", reasons: ["Minor budget increase (under 5%)", "Scope addition documented with equipment quotation"], calculatedAt: "2025-11-02T00:05:00.000Z" },
  { id: "crs-5", changeId: "change-5", score: 0, priority: "LOW", reasons: ["Routine status update — subcontractor mobilization"], calculatedAt: "2025-10-15T00:05:00.000Z" },
];
