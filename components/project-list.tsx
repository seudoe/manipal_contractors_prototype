import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types/project";
import { getProjectOverallProgress } from "@/db/queries";

export function ProjectList({
  projects,
  basePath,
  defaultTab = "dashboard",
}: {
  projects: Project[];
  basePath: string;
  /** tab to land on when opening a project — inspector has no dashboard, so pass "changes" there */
  defaultTab?: string;
}) {
  if (projects.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-black/10 p-8 text-center text-sm text-zinc-500 dark:border-white/15">
        No projects linked to your account yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {projects.map((project) => {
        const progress = getProjectOverallProgress(project.id);
        return (
          <Link
            key={project.id}
            href={`${basePath}/${project.id}/${defaultTab}`}
            className="group flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-5 transition-colors hover:border-black/20 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-black dark:text-zinc-50">
                  {project.name}
                </h3>
                <p className="text-sm text-zinc-500">{project.domain}</p>
              </div>
              <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {project.status.replaceAll("_", " ")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-black dark:bg-white"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-medium text-zinc-500">{progress}%</span>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>
                {project.currency} {project.contractValue.toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-black group-hover:underline dark:text-white">
                Open <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
