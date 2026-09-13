import type { FeatureAssignment } from "@/types/contractor";

export const featureAssignments: FeatureAssignment[] = [
  // project-1 — BuildCorp responsible directly, electrical/wiring subcontracted to ElectroWorks
  { id: "fa-1", projectId: "project-1", nodeId: "node-1-foundation", contractorId: "contractor-1", assignmentType: "RESPONSIBLE", createdAt: "2025-03-16T00:00:00.000Z" },
  { id: "fa-2", projectId: "project-1", nodeId: "node-1-structure", contractorId: "contractor-1", assignmentType: "RESPONSIBLE", createdAt: "2025-03-16T00:00:00.000Z" },
  { id: "fa-3", projectId: "project-1", nodeId: "node-1-plumbing", contractorId: "contractor-1", assignmentType: "RESPONSIBLE", createdAt: "2025-03-16T00:00:00.000Z" },
  { id: "fa-4", projectId: "project-1", nodeId: "node-1-electrical", contractorId: "contractor-2", assignmentType: "SUBCONTRACTED", createdAt: "2025-03-20T00:00:00.000Z" },
  { id: "fa-5", projectId: "project-1", nodeId: "node-1-wiring", contractorId: "contractor-2", assignmentType: "SUBCONTRACTED", createdAt: "2025-03-20T00:00:00.000Z" },

  // project-2 — SkyRise Builders responsible directly, plumbing subcontracted to AquaBuild
  { id: "fa-6", projectId: "project-2", nodeId: "node-2-foundation", contractorId: "contractor-3", assignmentType: "RESPONSIBLE", createdAt: "2025-05-11T00:00:00.000Z" },
  { id: "fa-7", projectId: "project-2", nodeId: "node-2-structure", contractorId: "contractor-3", assignmentType: "RESPONSIBLE", createdAt: "2025-05-11T00:00:00.000Z" },
  { id: "fa-8", projectId: "project-2", nodeId: "node-2-medequip", contractorId: "contractor-3", assignmentType: "RESPONSIBLE", createdAt: "2025-05-11T00:00:00.000Z" },
  { id: "fa-9", projectId: "project-2", nodeId: "node-2-water", contractorId: "contractor-4", assignmentType: "SUBCONTRACTED", createdAt: "2025-05-18T00:00:00.000Z" },

  // project-3 — new project, BuildCorp responsible for everything so far
  { id: "fa-10", projectId: "project-3", nodeId: "node-3-survey", contractorId: "contractor-1", assignmentType: "RESPONSIBLE", createdAt: "2026-08-20T00:00:00.000Z" },
  { id: "fa-11", projectId: "project-3", nodeId: "node-3-pipeline", contractorId: "contractor-1", assignmentType: "RESPONSIBLE", createdAt: "2026-08-20T00:00:00.000Z" },

  // project-4 — SkyRise Builders responsible for the whole software build
  { id: "fa-12", projectId: "project-4", nodeId: "node-4-auth", contractorId: "contractor-3", assignmentType: "RESPONSIBLE", createdAt: "2025-10-16T00:00:00.000Z" },
  { id: "fa-13", projectId: "project-4", nodeId: "node-4-payments", contractorId: "contractor-3", assignmentType: "RESPONSIBLE", createdAt: "2025-10-16T00:00:00.000Z" },
  { id: "fa-14", projectId: "project-4", nodeId: "node-4-records", contractorId: "contractor-3", assignmentType: "RESPONSIBLE", createdAt: "2025-10-16T00:00:00.000Z" },
  { id: "fa-15", projectId: "project-4", nodeId: "node-4-deploy", contractorId: "contractor-3", assignmentType: "RESPONSIBLE", createdAt: "2025-10-16T00:00:00.000Z" },
];
