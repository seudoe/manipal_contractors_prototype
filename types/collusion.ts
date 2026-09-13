/**
 * ANUBANDH prototype addition — types for the collusion graph (TASK 8).
 * This graph is relational (firms cluster, they don't rank), so its nodes
 * carry hand-authored x/y positions rather than being laid out by dagre.
 */

export type CollusionMotifType =
  | "SHARED_DIRECTOR"
  | "SHARED_ADDRESS"
  | "SHARED_BANK"
  | "RECENT_INCORPORATION"
  | "LOSING_BIDDER_AS_SUB";

export type CollusionSeverity = "LOW" | "MEDIUM" | "HIGH";

export interface CollusionFinding {
  id: string;
  motifType: CollusionMotifType;
  severity: CollusionSeverity;
  entityIds: string[];
  explanation: string;
}

export interface CollusionGraphNode {
  id: string;
  entityId: string;
  label: string;
  gstin?: string;
  incorporationDate?: string;
  x: number;
  y: number;
}

export interface CollusionGraphEdge {
  id: string;
  findingId: string;
  source: string;
  target: string;
  motifType: CollusionMotifType;
  label: string;
}
