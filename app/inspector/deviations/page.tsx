import { DeviationQueueView, type QueueRow } from "@/components/anubandh/deviation-queue-view";
import { getDeviationQueue, getProjectById } from "@/db/queries";

export default function Page() {
  const queue = getDeviationQueue();

  const rows: QueueRow[] = queue.map((deviation) => {
    const project = getProjectById(deviation.projectId);
    return {
      deviation,
      projectName: project?.name ?? deviation.projectId,
      href: `/inspector/project/${deviation.projectId}/deviations/${deviation.id}`,
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
          Deviation Queue
        </h1>
        <p className="text-sm text-zinc-500">Across every project, already sorted by priority.</p>
      </div>
      <DeviationQueueView rows={rows} />
    </div>
  );
}
