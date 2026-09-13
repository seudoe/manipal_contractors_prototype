import { notFound } from "next/navigation";
import { DecisionCard } from "@/components/anubandh/decision-card";
import { OverrideConfirm } from "@/components/anubandh/override-confirm";
import { getGateEventById, getProjectById } from "@/db/queries";
import { getSessionUser } from "@/lib/session";

export default async function Page({
  params,
}: {
  params: Promise<{ project_id: string; gateEventId: string }>;
}) {
  const { project_id, gateEventId } = await params;
  const gateEvent = getGateEventById(gateEventId);
  if (!gateEvent || gateEvent.projectId !== project_id) notFound();

  const project = getProjectById(project_id);
  const user = await getSessionUser();
  const officerName = user?.name ?? "Unknown officer";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Override — {gateEvent.checkpointLabel}
        </h1>
        <p className="text-sm text-slate-500">{project?.name}</p>
      </div>

      <DecisionCard
        decision={gateEvent.decision}
        level={gateEvent.level}
        reasons={gateEvent.reasons}
        valueAtRisk={gateEvent.valueAtRisk}
        timeRemaining={gateEvent.timeRemaining}
      />

      <OverrideConfirm officerName={officerName} />

      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        Chain intact
      </span>
    </div>
  );
}
