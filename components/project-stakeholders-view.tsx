import { UserCircle } from "lucide-react";
import { getProjectStakeholders } from "@/db/queries";

const ROLE_STYLES: Record<string, string> = {
  OWNER: "bg-black text-white dark:bg-white dark:text-black",
  EDITOR: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  VIEWER: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

/** spec section 6 — a project can have multiple stakeholders (one OWNER). */
export function ProjectStakeholdersView({ projectId }: { projectId: string }) {
  const stakeholders = getProjectStakeholders(projectId);

  return (
    <div className="flex flex-col gap-3">
      {stakeholders.map((ps) => (
        <div
          key={ps.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-3">
            <UserCircle size={28} className="text-zinc-400" />
            <div>
              <p className="text-sm font-medium text-black dark:text-zinc-50">
                {ps.user?.name ?? ps.userId}
              </p>
              <p className="text-xs text-zinc-500">{ps.user?.email}</p>
            </div>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ROLE_STYLES[ps.role]}`}>
            {ps.role}
          </span>
        </div>
      ))}
    </div>
  );
}
