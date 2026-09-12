/**
 * spec: project_coding_spec.md section 9 (Project Feature DAG) + section 10 (Project Graph Edges)
 * + section 12 (Feature Metadata) + section 26 (Core TypeScript Interfaces)
 *
 * The project graph contains FEATURES ONLY — no contractor nodes.
 *
 * NOTE: section 12's `ProjectNode` interface names this field `nodeType`, while
 * section 26's `GraphNode` interface (used here) calls it `type`. Same entity,
 * two names in the spec — pick one later.
 *
 * NOTE: section 26's `GraphEdge` interface omits `createdBy`/`createdAt`, but the
 * `project_edges` table in section 10 has both — kept here, drop if the interface wins.
 */

export type GraphNodeType = "PROJECT" | "FEATURE" | "SUBFEATURE";

export type GraphNodeStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "BLOCKED";

export interface GraphNode {
  id: string;
  projectId: string;
  type: GraphNodeType;

  name: string;
  description?: string;

  status: GraphNodeStatus;
  progress: number;
  shouldCompleteBy?: string;

  /** intentionally flexible — domain-specific fields (e.g. material, technology) */
  metadata: Record<string, unknown>;

  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type GraphEdgeRelationship = "DEPENDENCY";

/**
 * source -> target means "target depends on source" (section 10).
 * The same node can be a dependency (source) of multiple targets, since this
 * is a DAG rather than a tree.
 */
export interface GraphEdge {
  id: string;
  projectId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationship: GraphEdgeRelationship;
  createdBy: string;
  createdAt: string;
}
