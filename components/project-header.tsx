import type { Project } from "@/types/project";
import { AssignContractorButton, type AssignableContractor } from "@/components/assign-contractor-button";
import { getProjectById } from "@/db/queries";

export function ProjectHeader({
  project,
  assignableContractors,
}: {
  project: Project;
  /** pass this only from the stakeholder project layout — that's what gates the button to stakeholders */
  assignableContractors?: AssignableContractor[];
}) {
  const needsAward = !project.mainContractorId;
  const parentProject = project.partOfProjectId ? getProjectById(project.partOfProjectId) : undefined;

  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-indigo-200 pb-4 dark:border-indigo-800/40">
      <div>
        <div className="flex flex-wrap items-baseline gap-2">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            {project.name}
          </h1>
          {parentProject && (
            <span className="max-w-[220px] truncate text-sm text-slate-400">
              part of {parentProject.name}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-slate-500">{project.domain}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {project.status.replaceAll("_", " ")}
        </span>
        {needsAward && assignableContractors && (
          <AssignContractorButton projectId={project.id} contractors={assignableContractors} />
        )}
      </div>
    </div>
  );
}
