import Link from "next/link";
import { QrCode } from "lucide-react";
import { getProjectById } from "@/db/queries";

export default async function Page({
  params,
}: {
  params: Promise<{ project_id: string }>;
}) {
  const { project_id } = await params;
  const project = getProjectById(project_id);
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

      {/* ANUBANDH addition (TASK 10.3) — static site notice board block, display only */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-800/40 dark:bg-slate-900">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-black/15 bg-slate-50 dark:border-indigo-800/50 dark:bg-slate-800">
          <QrCode size={40} className="text-slate-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Site notice board</p>
          <p className="text-xs text-slate-500">
            Citizens can scan this code on-site or visit the public project page directly.
          </p>
          <Link
            href={`/public/${project_id}`}
            target="_blank"
            className="mt-1 inline-block text-xs font-medium text-slate-900 underline dark:text-slate-50"
          >
            View public page
          </Link>
        </div>
      </div>
    </div>
  );
}
