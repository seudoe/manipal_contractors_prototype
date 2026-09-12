import type { User } from "@/types/user";
import type { Contractor, ProjectContractor, FeatureAssignment } from "@/types/contractor";
import type { Project, ProjectStakeholder } from "@/types/project";
import type { GraphNode, GraphEdge } from "@/types/graph";
import type {
  ProjectVersion,
  ProjectChange,
  ChangeReview,
  ChangeRiskScore,
} from "@/types/change";

import { users } from "./users";
import { contractors } from "./contractors";
import { projects } from "./projects";
import { projectStakeholders } from "./project-stakeholders";
import { projectContractors } from "./project-contractors";
import { nodes } from "./nodes";
import { edges } from "./edges";
import { featureAssignments } from "./feature-assignments";
import { versions } from "./versions";
import { changes, changeReviews, changeRiskScores } from "./changes";

/**
 * Data-access layer for the demo dataset. Every exported function here is
 * the seam to swap out later for real Supabase/Prisma queries — pages and
 * server actions should only ever import from db/queries.ts, never reach
 * into the raw arrays (db/users.ts, db/projects.ts, ...) directly.
 *
 * Everything is synchronous in-memory lookups for now, but functions are
 * still typed/shaped as if they could be async later without callers
 * needing to change beyond adding `await`.
 */

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export function getUsers(): User[] {
  return users;
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/** Registers a new user (mutates the in-memory `users` table) and returns it. */
export function createUser(data: {
  email: string;
  name: string;
  password: string;
  globalRole: User["globalRole"];
}): User {
  const now = new Date().toISOString();
  const user: User = {
    id: `new-user-${users.length + 1}`,
    email: data.email,
    name: data.name,
    globalRole: data.globalRole,
    password: data.password,
    createdAt: now,
    updatedAt: now,
  };
  users.push(user);
  return user;
}

// ---------------------------------------------------------------------------
// Contractors
// ---------------------------------------------------------------------------

export function getContractors(): Contractor[] {
  return contractors;
}

export function getContractorById(id: string): Contractor | undefined {
  return contractors.find((c) => c.id === id);
}

export function getContractorByUserId(userId: string): Contractor | undefined {
  return contractors.find((c) => c.userId === userId);
}

/** Direct children only (one level down), not the full subtree. */
export function getSubcontractors(contractorId: string): Contractor[] {
  return contractors.filter((c) => c.parentContractorId === contractorId);
}

/** Ancestor chain from the given contractor up to (and including) the main contractor. */
export function getContractorAncestors(contractorId: string): Contractor[] {
  const chain: Contractor[] = [];
  let current = getContractorById(contractorId);
  while (current?.parentContractorId) {
    const parent = getContractorById(current.parentContractorId);
    if (!parent) break;
    chain.push(parent);
    current = parent;
  }
  return chain;
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export function getProjects(): Project[] {
  return projects;
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

/**
 * Projects visible to a given user, based on their role:
 * - STAKEHOLDER: projects they're listed on via project_stakeholders
 * - CONTRACTOR: projects their contractor org is linked to via project_contractors
 * - INSPECTOR: the spec doesn't define an inspector<->project link table
 *   (project_coding_spec.md never introduces one), so inspectors see every
 *   project for now. Revisit once/if that table is added to the spec.
 */
export function getProjectsForUser(userId: string): Project[] {
  const user = getUserById(userId);
  if (!user) return [];

  if (user.globalRole === "STAKEHOLDER") {
    const projectIds = new Set(
      projectStakeholders.filter((ps) => ps.userId === userId).map((ps) => ps.projectId)
    );
    return projects.filter((p) => projectIds.has(p.id));
  }

  if (user.globalRole === "CONTRACTOR") {
    const contractor = getContractorByUserId(userId);
    if (!contractor) return [];
    const projectIds = new Set(
      projectContractors.filter((pc) => pc.contractorId === contractor.id).map((pc) => pc.projectId)
    );
    return projects.filter((p) => projectIds.has(p.id));
  }

  // INSPECTOR (or any future role) — no scoping table yet, see note above
  return projects;
}

export function getProjectStakeholders(projectId: string): (ProjectStakeholder & { user?: User })[] {
  return projectStakeholders
    .filter((ps) => ps.projectId === projectId)
    .map((ps) => ({ ...ps, user: getUserById(ps.userId) }));
}

export function getProjectContractors(projectId: string): (ProjectContractor & { contractor?: Contractor })[] {
  return projectContractors
    .filter((pc) => pc.projectId === projectId)
    .map((pc) => ({ ...pc, contractor: getContractorById(pc.contractorId) }));
}

export function getMainContractor(projectId: string): Contractor | undefined {
  const project = getProjectById(projectId);
  return project ? getContractorById(project.mainContractorId) : undefined;
}

// ---------------------------------------------------------------------------
// Project graph (nodes + edges)
// ---------------------------------------------------------------------------

export interface ProjectGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function getProjectGraph(projectId: string): ProjectGraph {
  return {
    nodes: nodes.filter((n) => n.projectId === projectId),
    edges: edges.filter((e) => e.projectId === projectId),
  };
}

export function getNodeById(nodeId: string): GraphNode | undefined {
  return nodes.find((n) => n.id === nodeId);
}

/** The root PROJECT-type node's progress, used as the "overall progress" figure. */
export function getProjectOverallProgress(projectId: string): number {
  const root = nodes.find((n) => n.projectId === projectId && n.type === "PROJECT");
  return root?.progress ?? 0;
}

/** Feature/subfeature nodes (excludes the root PROJECT node) that aren't yet COMPLETED. */
export function getActiveFeatureCount(projectId: string): number {
  return nodes.filter(
    (n) => n.projectId === projectId && n.type !== "PROJECT" && n.status !== "COMPLETED"
  ).length;
}

export function getFeatureAssignments(projectId: string): (FeatureAssignment & { contractor?: Contractor })[] {
  return featureAssignments
    .filter((fa) => fa.projectId === projectId)
    .map((fa) => ({ ...fa, contractor: getContractorById(fa.contractorId) }));
}

/** Which nodes a given contractor is responsible for/subcontracted on, within a project. */
export function getFeatureAssignmentsForContractor(
  projectId: string,
  contractorId: string
): (FeatureAssignment & { node?: GraphNode })[] {
  return featureAssignments
    .filter((fa) => fa.projectId === projectId && fa.contractorId === contractorId)
    .map((fa) => ({ ...fa, node: getNodeById(fa.nodeId) }));
}

export interface ContractorTreeNode {
  contractor: Contractor;
  /** distance from the project's main contractor, computed within this project's contractor set */
  depth: number;
  features: string[];
}

export interface ContractorTreeEdge {
  parentId: string;
  childId: string;
}

/**
 * The "who hired whom" hierarchy for a project, restricted to the
 * contractors actually linked to it via project_contractors — plus which
 * features each of them is responsible for. Used to render the contractor
 * hierarchy as a graph (main contractor at top, subcontractors below).
 */
export function getProjectContractorTree(
  projectId: string
): { nodes: ContractorTreeNode[]; edges: ContractorTreeEdge[] } {
  const inProject = getProjectContractors(projectId)
    .map((pc) => pc.contractor)
    .filter((c): c is Contractor => Boolean(c));
  const idsInProject = new Set(inProject.map((c) => c.id));

  function depthOf(contractor: Contractor): number {
    let depth = 0;
    let current = contractor;
    while (current.parentContractorId && idsInProject.has(current.parentContractorId)) {
      const parent = getContractorById(current.parentContractorId);
      if (!parent) break;
      depth++;
      current = parent;
    }
    return depth;
  }

  const treeNodes: ContractorTreeNode[] = inProject.map((contractor) => ({
    contractor,
    depth: depthOf(contractor),
    features: getFeatureAssignmentsForContractor(projectId, contractor.id)
      .map((fa) => fa.node?.name)
      .filter((n): n is string => Boolean(n)),
  }));

  const treeEdges: ContractorTreeEdge[] = inProject
    .filter((c) => c.parentContractorId && idsInProject.has(c.parentContractorId))
    .map((c) => ({ parentId: c.parentContractorId as string, childId: c.id }));

  return { nodes: treeNodes, edges: treeEdges };
}

export interface SubcontractedNodeGroup {
  contractorId: string;
  contractorName: string;
  nodeIds: string[];
}

/**
 * Nodes handed off to a subcontractor (assignmentType SUBCONTRACTED),
 * grouped by contractor — used to draw the "this work belongs to X" box
 * around a cluster of nodes in the project graph.
 */
export function getSubcontractedNodeGroups(projectId: string): SubcontractedNodeGroup[] {
  const byContractor = new Map<string, string[]>();
  for (const fa of featureAssignments) {
    if (fa.projectId !== projectId || fa.assignmentType !== "SUBCONTRACTED") continue;
    if (!byContractor.has(fa.contractorId)) byContractor.set(fa.contractorId, []);
    byContractor.get(fa.contractorId)!.push(fa.nodeId);
  }
  return [...byContractor.entries()].map(([contractorId, nodeIds]) => ({
    contractorId,
    contractorName: getContractorById(contractorId)?.name ?? contractorId,
    nodeIds,
  }));
}

// ---------------------------------------------------------------------------
// Versions & changes
// ---------------------------------------------------------------------------

export function getProjectVersions(projectId: string): ProjectVersion[] {
  return versions
    .filter((v) => v.projectId === projectId)
    .sort((a, b) => a.versionNumber - b.versionNumber);
}

export function getProjectChanges(projectId: string): ProjectChange[] {
  return changes
    .filter((c) => c.projectId === projectId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function getChangeById(changeId: string): ProjectChange | undefined {
  return changes.find((c) => c.id === changeId);
}

export function getChangeReviews(changeId: string): ChangeReview[] {
  return changeReviews.filter((r) => r.changeId === changeId);
}

export function getChangeRiskScore(changeId: string): ChangeRiskScore | undefined {
  return changeRiskScores.find((s) => s.changeId === changeId);
}

/** A change bundled with its reviews and risk score — convenient for a changes/[id] page. */
export interface ChangeDetail {
  change: ProjectChange;
  reviews: ChangeReview[];
  riskScore?: ChangeRiskScore;
}

export function getChangeDetail(changeId: string): ChangeDetail | undefined {
  const change = getChangeById(changeId);
  if (!change) return undefined;
  return {
    change,
    reviews: getChangeReviews(changeId),
    riskScore: getChangeRiskScore(changeId),
  };
}
