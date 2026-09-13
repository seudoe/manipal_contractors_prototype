import { getProjectContractorTree } from "@/db/queries";
import { ContractorGraphFlow } from "@/components/graph/contractor-graph-flow";

/** spec section 50 — Contractor Details Page: who hired whom, and what each is responsible for. */
export function ProjectContractorDetailsView({ projectId }: { projectId: string }) {
  const { nodes, edges } = getProjectContractorTree(projectId);

  if (nodes.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-indigo-200 p-8 text-center text-sm text-slate-500 dark:border-indigo-800/50">
        No contractors assigned yet.
      </p>
    );
  }

  return <ContractorGraphFlow nodes={nodes} edges={edges} />;
}
