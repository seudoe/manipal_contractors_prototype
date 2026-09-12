import type { Project } from "@/types/project";

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-black/10 pb-4 dark:border-white/10">
      <div>
        <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
          {project.name}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">{project.domain}</p>
      </div>
      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
        {project.status.replaceAll("_", " ")}
      </span>
    </div>
  );
}
