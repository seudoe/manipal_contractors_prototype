import { Building2 } from "lucide-react";
import {
  getMainContractor,
  getSubcontractors,
  getFeatureAssignmentsForContractor,
} from "@/db/queries";

/** spec section 50 — Contractor Details Page: main contractor + subcontractor chain. */
export function ProjectContractorDetailsView({ projectId }: { projectId: string }) {
  const mainContractor = getMainContractor(projectId);

  if (!mainContractor) {
    return (
      <p className="rounded-xl border border-dashed border-black/10 p-8 text-center text-sm text-zinc-500 dark:border-white/15">
        No main contractor assigned yet.
      </p>
    );
  }

  const subcontractors = getSubcontractors(mainContractor.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-zinc-500">Main Contractor</h3>
        <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
          <Building2 size={28} className="text-zinc-400" />
          <div>
            <p className="text-sm font-medium text-black dark:text-zinc-50">{mainContractor.name}</p>
            <p className="text-xs text-zinc-500">{mainContractor.description}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-zinc-500">Subcontractor Chain</h3>
        {subcontractors.length === 0 ? (
          <p className="rounded-xl border border-dashed border-black/10 p-6 text-center text-sm text-zinc-500 dark:border-white/15">
            No subcontractors on this project yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2 border-l-2 border-zinc-200 pl-4 dark:border-zinc-800">
            {subcontractors.map((sub) => {
              const assignments = getFeatureAssignmentsForContractor(projectId, sub.id);
              return (
                <div
                  key={sub.id}
                  className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900"
                >
                  <p className="text-sm font-medium text-black dark:text-zinc-50">{sub.name}</p>
                  <p className="text-xs text-zinc-500">{sub.description}</p>
                  {assignments.length > 0 && (
                    <p className="mt-2 text-xs text-zinc-500">
                      Responsible for: {assignments.map((a) => a.node?.name).filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
