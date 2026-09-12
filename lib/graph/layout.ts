import dagre from "@dagrejs/dagre";

/**
 * Real hierarchical auto-layout via dagre (longest-path ranking + median
 * crossing-minimization + coordinate assignment) instead of hand-rolled
 * per-type centering — that's what was producing crossed/overlapping edges.
 *
 * Direction matters: our edges mean "target depends on source" (db/edges.ts),
 * so the node everything ultimately points at (the project root, or the
 * main contractor's... no, the main contractor is the *source*) ends up at
 * whichever end dagre puts the highest-rank (most-depended-on) nodes.
 * - Feature graph: edges flow feature -> project root, so the root is the
 *   sink (highest rank) and should render at the top => rankdir "BT".
 * - Contractor graph: edges flow parent -> child, so the main contractor is
 *   the source (rank 0) and should render at the top => rankdir "TB".
 */

export const NODE_WIDTH = 190;
export const NODE_HEIGHT = 52;

export interface Point {
  x: number;
  y: number;
}

export interface LayoutEdge {
  source: string;
  target: string;
}

/** Returns each node's top-left position (dagre itself works in center coordinates). */
export function layoutWithDagre(
  nodeIds: string[],
  edges: LayoutEdge[],
  direction: "TB" | "BT",
  nodeSize: { width: number; height: number } = { width: NODE_WIDTH, height: NODE_HEIGHT }
): Map<string, Point> {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 48, ranksep: 90, marginx: 24, marginy: 24 });

  for (const id of nodeIds) {
    g.setNode(id, { width: nodeSize.width, height: nodeSize.height });
  }
  for (const edge of edges) {
    if (nodeIds.includes(edge.source) && nodeIds.includes(edge.target)) {
      g.setEdge(edge.source, edge.target);
    }
  }

  dagre.layout(g);

  const positions = new Map<string, Point>();
  for (const id of nodeIds) {
    const n = g.node(id);
    positions.set(id, { x: n.x - nodeSize.width / 2, y: n.y - nodeSize.height / 2 });
  }
  return positions;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Bounding box (with padding) around a set of already-positioned nodes — used to draw the subcontractor rectangle behind them. */
export function boundingBoxOf(
  positions: Point[],
  nodeSize: { width: number; height: number } = { width: NODE_WIDTH, height: NODE_HEIGHT },
  padding = 28
): BoundingBox | undefined {
  if (positions.length === 0) return undefined;
  const minX = Math.min(...positions.map((p) => p.x));
  const minY = Math.min(...positions.map((p) => p.y));
  const maxX = Math.max(...positions.map((p) => p.x + nodeSize.width));
  const maxY = Math.max(...positions.map((p) => p.y + nodeSize.height));
  const topLabelSpace = 26;
  return {
    x: minX - padding,
    y: minY - padding - topLabelSpace,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2 + topLabelSpace,
  };
}
