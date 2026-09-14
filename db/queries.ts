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
import type { Notification } from "@/types/notification";

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
import { notifications } from "./notifications";
import type { DailyReport } from "@/types/report";
import { dailyReports } from "./reports";

// ---- ANUBANDH prototype additions (plan.md/update (1).md) ----
import type { Commitment, CommitmentCredential } from "@/types/commitment";
import type { Observation, Expectation } from "@/types/observation";
import type { Deviation, GateEvent, Override } from "@/types/deviation";
import type { ScanScenario } from "@/types/verification";
import { commitments } from "./commitments";
import { credentials } from "./credentials";
import { observations } from "./observations";
import { expectations } from "./expectations";
import { deviations } from "./deviations";
import { gateEvents } from "./gate-events";
import { overrides } from "./overrides";
import { financials, type ProjectFinancial } from "./financial";
import { scanScenarios } from "./scan-scenarios";
import type { CollusionFinding, CollusionGraphNode, CollusionGraphEdge } from "@/types/collusion";
import { findings, collusionNodes, collusionEdges } from "./collusion";
import { impliedEvidenceRecords, type ImpliedEvidence } from "./implied-evidence";
import type { TimelineEntry } from "@/types/timeline";
import type { BillScanScenario, BillRecord } from "@/types/bill";
import { billScanScenarios } from "./bill-scans";
import { bills } from "./bills";

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

/**
 * Contractors a stakeholder can award a project to as MAIN_CONTRACTOR:
 * top-level orgs only (a stakeholder awards the main contractor, who then
 * brings on their own subcontractors later — not the other way around),
 * and only ones with a real linked login (`getUserById(c.userId)` resolves).
 * That second check is what excludes the undisclosed/shell entities the
 * collusion-detection feature surfaces (db/contractors.ts contractor-5/6) —
 * they have a `userId` that doesn't match any row in db/users.ts on purpose.
 */
export function getAssignableContractors(): Contractor[] {
  return contractors.filter(
    (c) => c.parentContractorId === null && getUserById(c.userId) !== undefined
  );
}

/**
 * Every real contractor except the given one — used for the "Assign to
 * other contractor" demo affordance on a graph node (contractor role only,
 * see components/graph/project-graph-flow.tsx). Unlike getAssignableContractors
 * this isn't restricted to top-level orgs, since any contractor — including
 * a subcontractor — can hand a feature further down to its own subcontractor.
 * Still excludes the undisclosed/shell entities (no matching db/users.ts row).
 */
export function getOtherContractors(contractorId: string): Contractor[] {
  return contractors.filter((c) => c.id !== contractorId && getUserById(c.userId) !== undefined);
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
 * - CONTRACTOR: projects their contractor org is linked to via project_contractors,
 *   minus any project superseded by that contractor's own partOfProjectId spin-off
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
    const visible = projects.filter((p) => projectIds.has(p.id));

    // If this contractor's own spin-off project (partOfProjectId) is in
    // their list, hide the parent it points at — otherwise the same work
    // shows up twice (once as the real project, once as their spin-off).
    // See types/project.ts#partOfProjectId.
    const superseded = new Set(
      visible.map((p) => p.partOfProjectId).filter((id): id is string => Boolean(id))
    );
    return visible.filter((p) => !superseded.has(p.id));
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
  if (!project?.mainContractorId) return undefined;
  return getContractorById(project.mainContractorId);
}

/**
 * One-time award of a project's main contractor. No-ops (returns the
 * project unchanged) if it's already been awarded — this is deliberately
 * NOT a general "change the main contractor" update endpoint (spec section
 * 5 says that must never exist); it only fires the very first time, from
 * `mainContractorId: null`.
 *
 * Also links the contractor via project_contractors (MAIN_CONTRACTOR),
 * flips status to "IN_PROGRESS", and notifies the contractor's user.
 */
export function assignMainContractor(
  projectId: string,
  contractorId: string,
  actingUserId: string
): Project | undefined {
  const project = projects.find((p) => p.id === projectId);
  const contractor = getContractorById(contractorId);
  if (!project || !contractor) return undefined;
  if (project.mainContractorId) return project; // already awarded — locked

  const now = new Date().toISOString();
  project.mainContractorId = contractorId;
  project.status = "IN_PROGRESS";
  project.updatedAt = now;

  if (!projectContractors.some((pc) => pc.projectId === projectId && pc.contractorId === contractorId)) {
    projectContractors.push({
      id: `pc-assign-${projectId}-${contractorId}`,
      projectId,
      contractorId,
      role: "MAIN_CONTRACTOR",
      createdAt: now,
    });
  }

  createNotification({
    projectId,
    recipientUserId: contractor.userId,
    actorUserId: actingUserId,
    type: "CONTRACTOR_ASSIGNED",
    title: "New project awarded",
    message: `Your company, ${contractor.name}, has been awarded as main contractor for "${project.name}".`,
    entityType: "PROJECT",
    entityId: projectId,
  });

  return project;
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
// Notifications
// ---------------------------------------------------------------------------

/**
 * spec section 22 — inspectors are excluded from user-change notifications
 * as a product rule; nothing here enforces that yet since the only
 * notification-producing action so far (assignMainContractor) targets a
 * contractor specifically. Revisit if/when more actions call createNotification.
 */
export function createNotification(
  data: Omit<Notification, "id" | "createdAt" | "readAt">
): Notification {
  const notification: Notification = {
    id: `notif-${notifications.length + 1}`,
    createdAt: new Date().toISOString(),
    readAt: null,
    ...data,
  };
  notifications.push(notification);
  return notification;
}

export function getNotificationsForUser(userId: string): Notification[] {
  return notifications
    .filter((n) => n.recipientUserId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getUnreadNotificationCount(userId: string): number {
  return notifications.filter((n) => n.recipientUserId === userId && !n.readAt).length;
}

// ---------------------------------------------------------------------------
// Daily reports
// ---------------------------------------------------------------------------

/**
 * Demo placeholder: returns the same 3 hardcoded reports regardless of
 * project — not filtered by projectId on purpose. Wire up real per-project
 * filtering (`dailyReports.filter(r => r.projectId === projectId)`) once
 * this needs to be more than a demo.
 */
export function getDailyReports(): DailyReport[] {
  return dailyReports;
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

// ---------------------------------------------------------------------------
// ANUBANDH prototype additions (plan.md/update (1).md) — plain array lookups
// and filters only, no computation. Every value returned here was
// hand-authored in the corresponding db/*.ts file.
// ---------------------------------------------------------------------------

export function getCommitmentsForProject(projectId: string): Commitment[] {
  return commitments.filter((c) => c.projectId === projectId);
}

export function getCommitmentById(commitmentId: string): Commitment | undefined {
  return commitments.find((c) => c.id === commitmentId);
}

export function getCredentialsForProject(projectId: string): CommitmentCredential[] {
  const commitmentIds = new Set(getCommitmentsForProject(projectId).map((c) => c.id));
  return credentials.filter((cred) => commitmentIds.has(cred.commitmentId));
}

export function getCredentialsForCommitment(commitmentId: string): CommitmentCredential[] {
  return credentials.filter((cred) => cred.commitmentId === commitmentId);
}

export function getObservationsForProject(projectId: string): Observation[] {
  return observations.filter((o) => o.projectId === projectId);
}

export function getObservationById(observationId: string): Observation | undefined {
  return observations.find((o) => o.id === observationId);
}

export function getPhotoObservationsForProject(projectId: string): Observation[] {
  return getObservationsForProject(projectId).filter((o) => o.sourceType === "SITE_PHOTO");
}

export function getExpectationsForProject(projectId: string): Expectation[] {
  const commitmentIds = new Set(getCommitmentsForProject(projectId).map((c) => c.id));
  return expectations.filter((e) => commitmentIds.has(e.commitmentId));
}

export function getExpectationById(expectationId: string): Expectation | undefined {
  return expectations.find((e) => e.id === expectationId);
}

export function getMissingExpectations(projectId: string): Expectation[] {
  return getExpectationsForProject(projectId).filter((e) => e.status === "MISSING");
}

export function getDeviationsForProject(projectId: string): Deviation[] {
  return deviations.filter((d) => d.projectId === projectId);
}

/** All deviations across all projects, already sorted by the hardcoded priority (descending). */
export function getDeviationQueue(): Deviation[] {
  return [...deviations].sort((a, b) => b.priority - a.priority);
}

export function getDeviationById(deviationId: string): Deviation | undefined {
  return deviations.find((d) => d.id === deviationId);
}

export function getGateEventsForProject(projectId: string): GateEvent[] {
  return gateEvents.filter((g) => g.projectId === projectId);
}

export function getGateEventById(gateEventId: string): GateEvent | undefined {
  return gateEvents.find((g) => g.id === gateEventId);
}

export function getOverrideById(overrideId: string): Override | undefined {
  return overrides.find((o) => o.id === overrideId);
}

export function getOverridesForProject(projectId: string): Override[] {
  const gateEventIds = new Set(getGateEventsForProject(projectId).map((g) => g.id));
  return overrides.filter((o) => gateEventIds.has(o.gateEventId));
}

/** All overrides across all projects — used by the override-audit screen. */
export function getAllOverrides(): Override[] {
  return overrides;
}

export function getFinancialForProject(projectId: string): ProjectFinancial | undefined {
  return financials.find((f) => f.projectId === projectId);
}

export function getScanScenarios(): ScanScenario[] {
  return scanScenarios;
}

export function getScanScenarioById(scenarioId: string): ScanScenario | undefined {
  return scanScenarios.find((s) => s.id === scenarioId);
}

export function getCollusionFindings(): CollusionFinding[] {
  return findings;
}

export interface CollusionGraph {
  nodes: CollusionGraphNode[];
  edges: CollusionGraphEdge[];
}

export function getCollusionGraph(): CollusionGraph {
  return { nodes: collusionNodes, edges: collusionEdges };
}

export function getImpliedEvidenceForProject(projectId: string): ImpliedEvidence | undefined {
  return impliedEvidenceRecords.find((i) => i.projectId === projectId);
}

export interface PublicProjectSummary {
  committedCount: number;
  verifiedCount: number;
  openCriticalCount: number;
  lastVerifiedDate: string;
}

/**
 * Aggregate counts only — no party names, no evidence, no case details.
 * Used by the unauthenticated public citizen view (app/public/[projectId]).
 */
export function getPublicProjectSummary(projectId: string): PublicProjectSummary {
  const project = getProjectById(projectId);
  const committedCount = getCommitmentsForProject(projectId).length;
  const verifiedCount = getExpectationsForProject(projectId).filter((e) => e.status === "MET").length;
  const openCriticalCount = getDeviationsForProject(projectId).filter(
    (d) => (d.level === "L3" || d.level === "L4") && d.status !== "CLOSED"
  ).length;
  const observedDates = getObservationsForProject(projectId).map((o) => o.observedAt);
  const lastVerifiedDate =
    observedDates.length > 0
      ? observedDates.reduce((latest, d) => (d > latest ? d : latest))
      : project?.updatedAt ?? "";

  return { committedCount, verifiedCount, openCriticalCount, lastVerifiedDate };
}

/**
 * Merges observations, deviations, gate events and overrides for a project
 * into one feed, sorted by each record's own existing timestamp — the same
 * kind of plain sort getProjectChanges already does by createdAt. Nothing
 * here is scored, derived, or authored on the fly.
 */
export function getProjectTimeline(projectId: string): TimelineEntry[] {
  const observationEntries: TimelineEntry[] = getObservationsForProject(projectId).map((o) => ({
    id: `obs-entry-${o.id}`,
    type: "OBSERVATION",
    at: o.observedAt,
    title: o.sourceLabel,
    description: o.observedValue,
    isPhoto: o.sourceType === "SITE_PHOTO",
    trustLabel: o.trustLabel,
    trustScore: o.trustScore,
  }));

  const deviationEntries: TimelineEntry[] = getDeviationsForProject(projectId).map((d) => ({
    id: `dev-entry-${d.id}`,
    type: "DEVIATION",
    at: d.raisedAt,
    title: d.title,
    description: d.reasons[0] ?? "",
    level: d.level,
    href: `/inspector/project/${projectId}/deviations/${d.id}`,
  }));

  const gateEventEntries: TimelineEntry[] = getGateEventsForProject(projectId).map((g) => ({
    id: `ge-entry-${g.id}`,
    type: "GATE_EVENT",
    at: g.at,
    title: g.checkpointLabel,
    description: g.reasons[0] ?? "",
    level: g.level,
    decision: g.decision,
  }));

  const overrideEntries: TimelineEntry[] = getOverridesForProject(projectId).map((o) => ({
    id: `ovr-entry-${o.id}`,
    type: "OVERRIDE",
    at: o.at,
    title: `Override by ${o.officerName}`,
    description: o.reason,
  }));

  return [...observationEntries, ...deviationEntries, ...gateEventEntries, ...overrideEntries].sort(
    (a, b) => b.at.localeCompare(a.at)
  );
}

// ---------------------------------------------------------------------------
// Bill verification & invoice history (additive queries)
// ---------------------------------------------------------------------------

export function getBillScanScenarios(): BillScanScenario[] {
  return billScanScenarios;
}

export function getBillScanScenarioById(id: string): BillScanScenario | undefined {
  return billScanScenarios.find((s) => s.id === id);
}

export function getBillsForContract(projectId: string): BillRecord[] {
  return bills.filter((b) => b.projectId === projectId);
}

export function getBillById(id: string): BillRecord | undefined {
  return bills.find((b) => b.id === id);
}
