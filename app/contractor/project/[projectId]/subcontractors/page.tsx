import { Building2 } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";
import { getSessionUser } from "@/lib/session";
import {
  getContractorByUserId,
  getSubcontractors,
  getProjectContractors,
  getFeatureAssignmentsForContractor,
} from "@/db/queries";

/**
 * spec section 51 — filtered by contractor hierarchy: a contractor only
 * sees its own direct subcontractors on this project, not the whole chain.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const user = await getSessionUser();
  const contractor = user ? getContractorByUserId(user.id) : undefined;

  if (!contractor) {
    return <ComingSoon title="Subcontractors" icon={Building2} />;
  }

  const projectContractorIds = new Set(
    getProjectContractors(projectId).map((pc) => pc.contractorId)
  );
  const mySubcontractors = getSubcontractors(contractor.id).filter((c) =>
    projectContractorIds.has(c.id)
  );

  if (mySubcontractors.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-black/10 p-8 text-center text-sm text-zinc-500 dark:border-white/15">
        You have no subcontractors on this project yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {mySubcontractors.map((sub) => {
        const assignments = getFeatureAssignmentsForContractor(projectId, sub.id);
        return (
          <div
            key={sub.id}
            className="flex flex-col gap-2 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-3">
              <Building2 size={24} className="text-zinc-400" />
              <div>
                <p className="text-sm font-medium text-black dark:text-zinc-50">{sub.name}</p>
                <p className="text-xs text-zinc-500">{sub.description}</p>
              </div>
            </div>
            {assignments.length > 0 && (
              <ul className="ml-9 flex flex-col gap-1 text-xs text-zinc-500">
                {assignments.map((a) => (
                  <li key={a.id}>
                    {a.node?.name} — {a.node?.progress}% ({a.node?.status.replaceAll("_", " ")})
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
