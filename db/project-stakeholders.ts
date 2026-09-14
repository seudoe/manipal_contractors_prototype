import type { ProjectStakeholder } from "@/types/project";

/**
 * Each project is shared between 2 stakeholders (one OWNER, one EDITOR).
 * The 3 stakeholders rotate across the 3 projects so each of them sits on
 * exactly two.
 */
export const projectStakeholders: ProjectStakeholder[] = [
  { id: "ps-1", projectId: "project-1", userId: "user-st-1", role: "OWNER", createdAt: "2025-03-15T00:00:00.000Z" },
  { id: "ps-2", projectId: "project-1", userId: "user-st-2", role: "EDITOR", createdAt: "2025-03-15T00:00:00.000Z" },

  { id: "ps-3", projectId: "project-2", userId: "user-st-2", role: "OWNER", createdAt: "2025-05-10T00:00:00.000Z" },
  { id: "ps-4", projectId: "project-2", userId: "user-st-3", role: "EDITOR", createdAt: "2025-05-10T00:00:00.000Z" },

  { id: "ps-5", projectId: "project-3", userId: "user-st-3", role: "OWNER", createdAt: "2026-08-20T00:00:00.000Z" },
  { id: "ps-6", projectId: "project-3", userId: "user-st-1", role: "EDITOR", createdAt: "2026-08-20T00:00:00.000Z" },

  // ANUBANDH addition (TASK 9) — rotation continues: project-4 gets user-st-1 (OWNER), user-st-2 (EDITOR)
  { id: "ps-7", projectId: "project-4", userId: "user-st-1", role: "OWNER", createdAt: "2025-10-15T00:00:00.000Z" },
  { id: "ps-8", projectId: "project-4", userId: "user-st-2", role: "EDITOR", createdAt: "2025-10-15T00:00:00.000Z" },

  // project-5 (ElectroWorks' standalone "Electrical & Signaling System" —
  // see db/projects.ts) keeps the same owner as project-1 for narrative
  // continuity, not because the two records are actually linked.
  { id: "ps-9", projectId: "project-5", userId: "user-st-1", role: "OWNER", createdAt: "2025-03-20T00:00:00.000Z" },
];
