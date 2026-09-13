import { notFound } from "next/navigation";
import { DeviationQueueView, type QueueRow } from "@/components/anubandh/deviation-queue-view";
import { getDeviationsForProject, getProjectById } from "@/db/queries";

export default async function Page({
  params,
}: {
  params: Promise<{ project_id: string }>;
}) {
  const { project_id } = await params;
  const project = getProjectById(project_id);
  if (!project) notFound();

  const deviations = [...getDeviationsForProject(project_id)].sort(
    (a, b) => b.priority - a.priority
  );

  const rows: QueueRow[] = deviations.map((deviation) => ({
    deviation,
    projectName: project.name,
    href: `/inspector/project/${project_id}/deviations/${deviation.id}`,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Deviations — {project.name}
        </h1>
        <p className="text-sm text-slate-500">Sorted by priority.</p>
      </div>
      <DeviationQueueView rows={rows} showProjectFilter={false} />
    </div>
  );
}
