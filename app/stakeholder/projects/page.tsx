import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";
import { ProjectList } from "@/components/project-list";
import { getSessionUser } from "@/lib/session";
import { getProjectsForUser } from "@/db/queries";

export default async function Page() {
  const user = await getSessionUser();
  const projects = user ? getProjectsForUser(user.id) : [];

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FolderKanban size={20} className="text-slate-400" />
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Projects
          </h1>
        </div>
        {/* Only stakeholders create projects — contractors are assigned to
            them, not the other way around. */}
        <Link
          href="/stakeholder/new-project"
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400"
        >
          <Plus size={16} />
          New Project
        </Link>
      </div>
      <ProjectList projects={projects} basePath="/stakeholder/project" />
    </div>
  );
}
