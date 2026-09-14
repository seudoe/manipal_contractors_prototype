import { createChildNode, type DraftNode } from "./types";

/**
 * Prototype-only "AI" generation — there is no model call here. Every
 * prompt gets the same hardcoded response after a fake 2-second "processing"
 * delay (see components/new-project/generate-graph-modal.tsx). The shape is
 * loosely modeled on project_graph_FINAL.json's example hospital project,
 * minus status/progress (see lib/new-project/types.ts's NOTE on why those
 * don't belong in a pre-award draft) and flattened from its DAG into a
 * simple containment tree to match this editor's data model.
 */

const AI_GENERATED_DOMAIN = "Construction";

/** Ignores `prompt` entirely — always returns the same tree. */
export function generateHardcodedTree(_prompt: string): { domain: string; root: DraftNode } {
  const wiring = createChildNode({
    nodeType: "SUBFEATURE",
    name: "Wiring",
    description: "Install electrical wiring throughout the building.",
    metadata: { material: "Copper cable" },
  });
  const lighting = createChildNode({
    nodeType: "SUBFEATURE",
    name: "Lighting",
    description: "Install lighting systems.",
    metadata: { fixtureType: "LED" },
  });
  const powerDistribution = createChildNode({
    nodeType: "SUBFEATURE",
    name: "Power Distribution",
    description: "Complete power distribution infrastructure.",
  });

  const electrical = createChildNode({
    name: "Electrical Systems",
    description: "Complete the building's electrical system.",
    children: [wiring, lighting, powerDistribution],
  });

  const foundation = createChildNode({
    name: "Foundation",
    description: "Complete foundation work.",
  });
  const structure = createChildNode({
    name: "Structural Work",
    description: "Construct the structural components of the building.",
  });
  const plumbing = createChildNode({
    name: "Plumbing",
    description: "Complete the building's plumbing system.",
  });
  const medicalEquipment = createChildNode({
    name: "Medical Equipment",
    description: "Procure and install required medical equipment.",
  });
  const exteriorWall = createChildNode({
    name: "Exterior Wall",
    description: "Construct the exterior wall.",
    metadata: { height: "20m" },
  });

  const root = createChildNode({
    nodeType: "PROJECT",
    name: "Government District Hospital",
    description: "Construction of a government district hospital.",
    children: [foundation, structure, electrical, plumbing, medicalEquipment, exteriorWall],
  });

  return { domain: AI_GENERATED_DOMAIN, root };
}

/**
 * "Tag the OG graph" path — instead of generating something fresh, pretends
 * the AI read the current tree's JSON and proposes one hardcoded addition
 * under the root, demonstrating "edit the existing graph" vs. "replace it."
 */
export function applyHardcodedEdit(root: DraftNode): DraftNode {
  const suggestion = createChildNode({
    name: "AI-Suggested Addition",
    description: "Placeholder feature the AI proposed after reviewing the current graph.",
    metadata: { source: "ai-suggestion" },
  });
  return { ...root, children: [...root.children, suggestion] };
}
