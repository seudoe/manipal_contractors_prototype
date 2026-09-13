import { CollusionBoard } from "@/components/anubandh/collusion-board";
import { getCollusionFindings, getCollusionGraph } from "@/db/queries";

export default function Page() {
  const { nodes, edges } = getCollusionGraph();
  const findings = getCollusionFindings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Collusion Graph</h1>
        <p className="text-sm text-slate-500">
          Firms cluster by shared identity signals rather than by hierarchy.
        </p>
      </div>
      <CollusionBoard nodes={nodes} edges={edges} findings={findings} />
    </div>
  );
}
