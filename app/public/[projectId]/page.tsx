import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { ReportConcernForm } from "@/components/anubandh/report-concern-form";
import { getProjectById, getPublicProjectSummary, getProjectStakeholders } from "@/db/queries";

/**
 * ANUBANDH — unauthenticated citizen view (TASK 10.2). Deliberately outside
 * the three role trees (app/contractor, app/stakeholder, app/inspector) so
 * no layout role-check applies. Shows only aggregate counts — no party
 * names, no evidence.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = getProjectById(projectId);
  if (!project) notFound();

  const summary = getPublicProjectSummary(projectId);
  const owner = getProjectStakeholders(projectId).find((s) => s.role === "OWNER");

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-zinc-50">{project.name}</h1>
        <p className="text-sm text-zinc-500">{owner?.user?.name ? `Commissioned by ${owner.user.name}` : project.domain}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Commitments made" value={String(summary.committedCount)} />
        <Stat label="Independently verified" value={String(summary.verifiedCount)} />
        <Stat
          label="Open critical cases"
          value={String(summary.openCriticalCount)}
          tone={summary.openCriticalCount > 0 ? "text-red-600 dark:text-red-400" : undefined}
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <ShieldCheck size={14} />
        Last verified {new Date(summary.lastVerifiedDate || Date.now()).toLocaleDateString()}
      </div>

      <p className="text-xs text-zinc-400">
        Party names and underlying evidence are not shown on this public page.
      </p>

      <ReportConcernForm />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tone ?? "text-black dark:text-zinc-50"}`}>{value}</p>
    </div>
  );
}
