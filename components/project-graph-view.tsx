import {
  getProjectGraph,
  getFeatureAssignments,
  getSubcontractedNodeGroups,
  getUserById,
} from "@/db/queries";
import { ProjectGraphFlow, type EnrichedGraphNode } from "@/components/graph/project-graph-flow";

/**
 * Root PROJECT node at the top, its FEATUREs below, their SUBFEATUREs below
 * that (see lib/graph/layout.ts) — rendered with @xyflow/react. Clicking a
 * node opens its details; nodes handed off to a subcontractor are enclosed
 * in a light-bordered box (see db/queries.ts#getSubcontractedNodeGroups).
 */
export function ProjectGraphView({ projectId }: { projectId: string }) {
  const { nodes, edges } = getProjectGraph(projectId);

  if (nodes.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-black/10 p-8 text-center text-sm text-zinc-500 dark:border-white/15">
        No graph nodes yet.
      </p>
    );
  }

  const assignmentByNode = new Map(
    getFeatureAssignments(projectId).map((fa) => [
      fa.nodeId,
      { contractorName: fa.contractor?.name ?? fa.contractorId, assignmentType: fa.assignmentType },
    ])
  );

  const enrichedNodes: EnrichedGraphNode[] = nodes.map((node) => ({
    ...node,
    creatorName: getUserById(node.createdBy)?.name,
    assignment: assignmentByNode.get(node.id),
  }));

  const groups = getSubcontractedNodeGroups(projectId);

  return <ProjectGraphFlow nodes={enrichedNodes} edges={edges} groups={groups} />;
}
