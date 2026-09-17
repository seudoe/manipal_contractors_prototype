import {
  getProjectGraph,
  getFeatureAssignments,
  getSubcontractedNodeGroups,
  getUserById,
  getContractorByUserId,
  getOtherContractors,
} from "@/db/queries";
import { getSessionUser } from "@/lib/session";
import { getGraphChangeHistory } from "@/lib/graph/change-history";
import { ProjectGraphFlow, type EnrichedGraphNode } from "@/components/graph/project-graph-flow";

/**
 * Root PROJECT node at the top, its FEATUREs below, their SUBFEATUREs below
 * that (see lib/graph/layout.ts) — rendered with @xyflow/react. Clicking a
 * node opens its details; nodes handed off to a subcontractor are enclosed
 * in a light-bordered box (see db/queries.ts#getSubcontractedNodeGroups).
 */
export async function ProjectGraphView({ projectId }: { projectId: string }) {
  const { nodes, edges } = getProjectGraph(projectId);

  if (nodes.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-indigo-200 p-8 text-center text-sm text-slate-500 dark:border-indigo-800/50">
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

  // Only a contractor session gets the "Assign to other contractor" button
  // on a node's detail card — it's a no-op demo affordance (see
  // components/graph/project-graph-flow.tsx), not real functionality.
  const sessionUser = await getSessionUser();
  const viewerContractor = sessionUser ? getContractorByUserId(sessionUser.id) : undefined;
  const assignableContractors = viewerContractor
    ? getOtherContractors(viewerContractor.id).map((c) => ({ id: c.id, name: c.name }))
    : undefined;

  const changeHistory = getGraphChangeHistory(projectId);

  return (
    <ProjectGraphFlow
      nodes={enrichedNodes}
      edges={edges}
      groups={groups}
      assignableContractors={assignableContractors}
      changeHistory={changeHistory}
    />
  );
}
