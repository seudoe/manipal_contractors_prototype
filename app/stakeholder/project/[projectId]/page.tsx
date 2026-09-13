import { getProjectById } from "@/db/queries";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = getProjectById(projectId);
  if (!project) return null;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600 dark:text-slate-300">{project.description}</p>
      <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-slate-500">Original Start</dt>
          <dd className="font-medium text-slate-900 dark:text-slate-50">{project.originalStartDate ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Original Completion</dt>
          <dd className="font-medium text-slate-900 dark:text-slate-50">{project.originalCompletionDate ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Currently Expected</dt>
          <dd className="font-medium text-slate-900 dark:text-slate-50">{project.currentExpectedCompletionDate ?? "—"}</dd>
        </div>
      </dl>
    </div>
  );
}
