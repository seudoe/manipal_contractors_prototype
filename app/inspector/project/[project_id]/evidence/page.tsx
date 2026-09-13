import { notFound } from "next/navigation";
import { EvidenceLightbox } from "@/components/anubandh/evidence-lightbox";
import { EmptyState } from "@/components/anubandh/empty-state";
import { getPhotoObservationsForProject, getProjectById } from "@/db/queries";

export default async function Page({
  params,
}: {
  params: Promise<{ project_id: string }>;
}) {
  const { project_id } = await params;
  const project = getProjectById(project_id);
  if (!project) notFound();

  const photos = getPhotoObservationsForProject(project_id);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-black dark:text-zinc-50">Evidence</h1>
        <p className="text-sm text-zinc-500">
          Every photo submitted as corroborating evidence — click one to see its trust rating.
        </p>
      </div>

      {photos.length === 0 ? (
        <EmptyState
          title="No photo evidence seeded for this project yet"
          description="This demo dataset only authors SITE_PHOTO observations for a subset of projects."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {photos.map((o) => (
            <div key={o.id} className="flex flex-col gap-1">
              <EvidenceLightbox observation={o} />
              <p className="truncate text-[11px] text-zinc-500">{o.sourceLabel}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
