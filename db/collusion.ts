import type { CollusionFinding, CollusionGraphNode, CollusionGraphEdge } from "@/types/collusion";

/**
 * ANUBANDH prototype addition — hand-authored collusion findings plus the
 * graph's nodes and edges, authored directly (not derived from
 * db/contractors.ts at runtime). See plan.md/update (1).md TASK 8.2.
 */
export const findings: CollusionFinding[] = [
  {
    id: "find-1",
    motifType: "SHARED_DIRECTOR",
    severity: "HIGH",
    entityIds: ["contractor-2", "contractor-5"],
    explanation:
      "ElectroWorks and Rapid Electricals share director Ramesh Menon — the same person sits on both boards despite being presented as unrelated firms.",
  },
  {
    id: "find-2",
    motifType: "SHARED_ADDRESS",
    severity: "HIGH",
    entityIds: ["contractor-2", "contractor-5"],
    explanation:
      "Both firms are registered at the same unit, 22 Industrial Estate, Turbhe, Navi Mumbai — a strong sign one is a shell of the other.",
  },
  {
    id: "find-3",
    motifType: "RECENT_INCORPORATION",
    severity: "MEDIUM",
    entityIds: ["contractor-5"],
    explanation:
      "Rapid Electricals was incorporated on 2025-02-10, just weeks before project-1's tender — a classic sign of a shell set up specifically around this contract.",
  },
  {
    id: "find-4",
    motifType: "LOSING_BIDDER_AS_SUB",
    severity: "HIGH",
    entityIds: ["contractor-6", "contractor-1"],
    explanation:
      "Shree Balaji Minerals lost the aggregate supply tender for project-1 to Quarry Q-114, yet is now supplying material on-site as an unofficial subcontractor — the losing bidder ended up doing the work anyway, undermining the competitive tender.",
  },
];

// Hand-positioned (not dagre-laid-out): this graph is relational, firms
// cluster rather than rank, so a hierarchical layout is the wrong tool.
export const collusionNodes: CollusionGraphNode[] = [
  { id: "cn-1", entityId: "contractor-1", label: "BuildCorp", gstin: "27AABCB1234C1Z8", incorporationDate: "2010-04-12", x: 60, y: 220 },
  { id: "cn-2", entityId: "contractor-2", label: "ElectroWorks", gstin: "27AABCE5678D1Z2", incorporationDate: "2015-06-01", x: 340, y: 60 },
  { id: "cn-3", entityId: "contractor-5", label: "Rapid Electricals", gstin: "27AABCR2468G1Z9", incorporationDate: "2025-02-10", x: 340, y: 260 },
  { id: "cn-4", entityId: "contractor-6", label: "Shree Balaji Minerals", gstin: "27XYZQ9988K1Z2", incorporationDate: "2018-03-01", x: 60, y: 420 },
];

export const collusionEdges: CollusionGraphEdge[] = [
  {
    id: "ce-1",
    findingId: "find-1",
    source: "contractor-2",
    target: "contractor-5",
    motifType: "SHARED_DIRECTOR",
    label: "Shared director (Ramesh Menon)",
  },
  {
    id: "ce-2",
    findingId: "find-2",
    source: "contractor-2",
    target: "contractor-5",
    motifType: "SHARED_ADDRESS",
    label: "Shared registered address",
  },
  {
    id: "ce-3",
    findingId: "find-4",
    source: "contractor-6",
    target: "contractor-1",
    motifType: "LOSING_BIDDER_AS_SUB",
    label: "Losing bidder, now on-site as a sub",
  },
];
