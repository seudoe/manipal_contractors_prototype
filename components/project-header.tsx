import type { Project } from "@/types/project";

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-indigo-200 pb-4 dark:border-indigo-800/40">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          {project.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{project.domain}</p>
      </div>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {project.status.replaceAll("_", " ")}
      </span>
    </div>
  );
}
