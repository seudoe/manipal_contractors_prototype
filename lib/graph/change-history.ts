/**
 * Prototype-only "what changed in the graph over time" feature. Real build
 * would have an AI model score how dramatic each change is; here it's all
 * hardcoded (per-project, keyed by projectId — only project-1 has data for
 * now since it's the richest demo project).
 *
 * The 5 entries form one chain: entries[4] is the change closest to the
 * project's original baseline, entries[3] built on top of that, ...,
 * entries[0] is the most recent change (index 0 = top of the list).
 * "Compare with Original" effectively undoes all 5; "Compare with Last
 * Change" only undoes entries[0].
 */

export interface GraphChangeEntry {
  id: string;
  summary: string;
  changedBy: string;
  date: string;
}

/** effect: 1 (no real effect) .. 5 (dramatic). Never 0 — a node with no
 * entry here for a given change simply wasn't touched by it. */
export interface NodeChangeEffect {
  nodeId: string;
  effect: number;
}

const PROJECT_1_ENTRIES: GraphChangeEntry[] = [
  {
    id: "gch-1-0",
    summary: "Electrical & Signaling budget line revised after SCADA vendor switch.",
    changedBy: "Vikram Shah",
    date: "2026-02-05",
  },
  {
    id: "gch-1-1",
    summary: "Elevated Track Structure completion pushed ~2.5 months — precast delivery delay.",
    changedBy: "Vikram Shah",
    date: "2026-01-20",
  },
  {
    id: "gch-1-2",
    summary: "Traction Power Wiring subcontractor changed from CableWorks to ElectroWorks.",
    changedBy: "Vikram Shah",
    date: "2025-09-10",
  },
  {
    id: "gch-1-3",
    summary: "Station Drainage & Plumbing scope note clarified — no schedule/cost impact.",
    changedBy: "Vikram Shah",
    date: "2025-06-02",
  },
  {
    id: "gch-1-4",
    summary: "Foundation depth finalized at 25m after geotechnical survey.",
    changedBy: "Vikram Shah",
    date: "2025-03-16",
  },
];

// index-aligned with PROJECT_1_ENTRIES
const PROJECT_1_EFFECTS: NodeChangeEffect[][] = [
  [
    { nodeId: "node-1-electrical", effect: 5 },
    { nodeId: "node-1-wiring", effect: 2 },
  ],
  [
    { nodeId: "node-1-structure", effect: 4 },
    { nodeId: "node-1-foundation", effect: 1 },
  ],
  [
    { nodeId: "node-1-wiring", effect: 5 },
    { nodeId: "node-1-electrical", effect: 3 },
  ],
  [{ nodeId: "node-1-plumbing", effect: 1 }],
  [
    { nodeId: "node-1-foundation", effect: 2 },
    { nodeId: "node-1-root", effect: 1 },
  ],
];

export interface GraphChangeHistory {
  entries: GraphChangeEntry[];
  effects: NodeChangeEffect[][];
}

export function getGraphChangeHistory(projectId: string): GraphChangeHistory | undefined {
  if (projectId === "project-1") {
    return { entries: PROJECT_1_ENTRIES, effects: PROJECT_1_EFFECTS };
  }
  return undefined;
}

/** Per-node severity for one specific entry in the chain — "the graph at that point in time." */
export function effectsAtEntry(effects: NodeChangeEffect[][], index: number): Map<string, number> {
  const map = new Map<string, number>();
  for (const { nodeId, effect } of effects[index] ?? []) {
    map.set(nodeId, effect);
  }
  return map;
}

/** Per-node severity if only the single most recent change (index 0) were undone/compared against. */
export function compareWithLastChange(effects: NodeChangeEffect[][]): Map<string, number> {
  return effectsAtEntry(effects, 0);
}

/** Per-node severity across the whole chain (max effect seen for that node, since it may have changed more than once). */
export function compareWithOriginal(effects: NodeChangeEffect[][]): Map<string, number> {
  const map = new Map<string, number>();
  for (const changeEffects of effects) {
    for (const { nodeId, effect } of changeEffects) {
      map.set(nodeId, Math.max(map.get(nodeId) ?? 0, effect));
    }
  }
  return map;
}

/** Highest severity within one change entry — used to color its number badge in the list. */
export function maxEffectOf(changeEffects: NodeChangeEffect[]): number {
  return changeEffects.reduce((max, e) => Math.max(max, e.effect), 1);
}
