import { FolderKanban } from "lucide-react";
import { ProjectList } from "@/components/project-list";
import { getSessionUser } from "@/lib/session";
import { getProjectsForUser } from "@/db/queries";

export default async function Page() {
  const user = await getSessionUser();
  const projects = user ? getProjectsForUser(user.id) : [];

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-2">
        <FolderKanban size={20} className="text-zinc-400" />
        <h1 className="text-lg font-semibold text-black dark:text-zinc-50">
          Projects
        </h1>
      </div>
      <ProjectList projects={projects} basePath="/stakeholder/project" />
    </div>
  );
}
