/**
 * Client-only scratch data model for the stakeholder's "New Project" editor.
 * This is NOT db/ data — it never touches db/queries.ts or the hardcoded
 * project arrays. It's a plain tree kept in React state and mirrored to
 * localStorage (see lib/new-project/storage.ts), because "Save Project" is
 * intentionally a no-op for now (see components/new-project/new-project-editor.tsx).
 *
 * Deliberately simpler than the real GraphNode/GraphEdge model: this is a
 * plain containment TREE (parent -> children), not a dependency DAG. Authoring
 * a brand-new project reads naturally as "add features under this node," so
 * edges here just mean "is a child of" and render top-down (dagre "TB",
 * parent above child) — unlike the read-only project graph elsewhere, whose
 * edges encode "depends on" and render bottom-up. Converting a finished draft
 * into a real project's nodes/edges (once "Save Project" does something) would
 * need to decide how containment maps to that dependency model — it doesn't
 * automatically.
 *
 * NOTE: no `status` or `progress` fields here on purpose, even though the
 * real GraphNode type (and project_graph_FINAL.json) has both — those only
 * mean something once a contractor has been awarded and execution has
 * started. A project still being drafted by a stakeholder hasn't been
 * awarded yet, so there's nothing in progress and nothing to have a status.
 * Whoever wires up "Save Project" will need to decide what these default to
 * (presumably NOT_STARTED / 0) when a draft becomes a real project.
 */

export type DraftNodeType = "PROJECT" | "FEATURE" | "SUBFEATURE";

export interface DraftNode {
  id: string;
  name: string;
  description?: string;
  nodeType: DraftNodeType;
  shouldCompleteBy?: string;
  /** free-form optional key/value pairs, both sides user-editable — e.g. material: concrete */
  metadata: Record<string, string>;
  children: DraftNode[];
}

export interface DraftProject {
  domain: string;
  root: DraftNode;
}

let idCounter = 0;
function newId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

export function createDefaultDraft(): DraftProject {
  return {
    domain: "",
    root: {
      id: newId("draft-root"),
      name: "Untitled Project",
      description: "",
      nodeType: "PROJECT",
      metadata: {},
      children: [],
    },
  };
}

export function createChildNode(overrides: Partial<Omit<DraftNode, "id">> = {}): DraftNode {
  return {
    id: newId("draft-node"),
    name: "New Feature",
    description: "",
    nodeType: "FEATURE",
    metadata: {},
    children: [],
    ...overrides,
  };
}

/** Returns a new tree with `updater` applied to the node matching `nodeId`. Immutable. */
export function updateNodeInTree(
  root: DraftNode,
  nodeId: string,
  updater: (node: DraftNode) => DraftNode
): DraftNode {
  if (root.id === nodeId) return updater(root);
  return { ...root, children: root.children.map((c) => updateNodeInTree(c, nodeId, updater)) };
}

/** Adds `child` under the node matching `parentId`. Immutable. */
export function addChildInTree(root: DraftNode, parentId: string, child: DraftNode): DraftNode {
  if (root.id === parentId) return { ...root, children: [...root.children, child] };
  return { ...root, children: root.children.map((c) => addChildInTree(c, parentId, child)) };
}

/** Removes the node matching `nodeId` (and its subtree). No-op if it's the root. Immutable. */
export function removeNodeFromTree(root: DraftNode, nodeId: string): DraftNode {
  return {
    ...root,
    children: root.children
      .filter((c) => c.id !== nodeId)
      .map((c) => removeNodeFromTree(c, nodeId)),
  };
}

export function findNodeInTree(root: DraftNode, nodeId: string): DraftNode | undefined {
  if (root.id === nodeId) return root;
  for (const child of root.children) {
    const found = findNodeInTree(child, nodeId);
    if (found) return found;
  }
  return undefined;
}

export interface FlatDraftEdge {
  parentId: string;
  childId: string;
}

/**
 * Flattens the tree into parallel arrays for the react-flow graph view.
 * `collapsedIds` are nodes whose subtree should be omitted (the node itself
 * still appears — see components/graph/draft-feature-node.tsx's collapse
 * toggle) — the graph-view equivalent of collapsing a directory in the List
 * tab, which handles this itself via each row's own expand/collapse state.
 */
export function flattenTree(
  root: DraftNode,
  collapsedIds: Set<string> = new Set()
): { nodes: DraftNode[]; edges: FlatDraftEdge[] } {
  const nodes: DraftNode[] = [];
  const edges: FlatDraftEdge[] = [];

  function walk(node: DraftNode) {
    nodes.push(node);
    if (collapsedIds.has(node.id)) return;
    for (const child of node.children) {
      edges.push({ parentId: node.id, childId: child.id });
      walk(child);
    }
  }

  walk(root);
  return { nodes, edges };
}

/** Total nodes in `node`'s subtree, not counting `node` itself. */
export function countDescendants(node: DraftNode): number {
  let count = 0;
  for (const child of node.children) {
    count += 1 + countDescendants(child);
  }
  return count;
}
