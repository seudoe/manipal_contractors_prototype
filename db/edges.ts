import type { GraphEdge } from "@/types/graph";

/** source -> target means "target depends on source" (spec section 10). */
export const edges: GraphEdge[] = [
  // project-1
  { id: "edge-1-1", projectId: "project-1", sourceNodeId: "node-1-foundation", targetNodeId: "node-1-structure", relationship: "DEPENDENCY", createdBy: "user-ct-1", createdAt: "2025-03-16T00:00:00.000Z" },
  { id: "edge-1-2", projectId: "project-1", sourceNodeId: "node-1-foundation", targetNodeId: "node-1-plumbing", relationship: "DEPENDENCY", createdBy: "user-ct-1", createdAt: "2025-03-16T00:00:00.000Z" },
  { id: "edge-1-3", projectId: "project-1", sourceNodeId: "node-1-wiring", targetNodeId: "node-1-electrical", relationship: "DEPENDENCY", createdBy: "user-ct-2", createdAt: "2025-03-16T00:00:00.000Z" },

  // project-2
  { id: "edge-2-1", projectId: "project-2", sourceNodeId: "node-2-foundation", targetNodeId: "node-2-structure", relationship: "DEPENDENCY", createdBy: "user-ct-3", createdAt: "2025-05-11T00:00:00.000Z" },
  { id: "edge-2-2", projectId: "project-2", sourceNodeId: "node-2-structure", targetNodeId: "node-2-water", relationship: "DEPENDENCY", createdBy: "user-ct-3", createdAt: "2025-05-11T00:00:00.000Z" },
  { id: "edge-2-3", projectId: "project-2", sourceNodeId: "node-2-structure", targetNodeId: "node-2-medequip", relationship: "DEPENDENCY", createdBy: "user-ct-3", createdAt: "2025-05-11T00:00:00.000Z" },

  // project-3
  { id: "edge-3-1", projectId: "project-3", sourceNodeId: "node-3-survey", targetNodeId: "node-3-pipeline", relationship: "DEPENDENCY", createdBy: "user-ct-1", createdAt: "2026-08-20T00:00:00.000Z" },
];
