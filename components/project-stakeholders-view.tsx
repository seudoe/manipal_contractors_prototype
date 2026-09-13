import { UserCircle } from "lucide-react";
import { getProjectStakeholders } from "@/db/queries";

const ROLE_STYLES: Record<string, string> = {
  OWNER: "bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white",
  EDITOR: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  VIEWER: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

/** spec section 6 — a project can have multiple stakeholders (one OWNER). */
export function ProjectStakeholdersView({ projectId }: { projectId: string }) {
  const stakeholders = getProjectStakeholders(projectId);

  return (
    <div className="flex flex-col gap-3">
      {stakeholders.map((ps) => (
        <div
          key={ps.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-800/40 dark:bg-slate-900"
        >
          <div className="flex items-center gap-3">
            <UserCircle size={28} className="text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                {ps.user?.name ?? ps.userId}
              </p>
              <p className="text-xs text-slate-500">{ps.user?.email}</p>
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
