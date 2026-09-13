import { notFound } from "next/navigation";
import { TimelineView } from "@/components/anubandh/timeline-view";
import { EmptyState } from "@/components/anubandh/empty-state";
import { getProjectTimeline, getProjectById } from "@/db/queries";

export default async function Page({
  params,
}: {
  params: Promise<{ project_id: string }>;
}) {
  const { project_id } = await params;
  const project = getProjectById(project_id);
  if (!project) notFound();

  const entries = getProjectTimeline(project_id);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-black dark:text-zinc-50">Timeline</h1>
        <p className="text-sm text-zinc-500">
          Every observation, deviation, gate decision and override for this project, in one feed.
        </p>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          title="No activity seeded for this project yet"
          description="This demo dataset only authors activity for a subset of projects."
        />
      ) : (
        <TimelineView entries={entries} />
      )}
    </div>
  );
}
