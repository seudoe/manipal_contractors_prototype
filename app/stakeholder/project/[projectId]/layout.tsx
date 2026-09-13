import { notFound, redirect } from "next/navigation";
import { ProjectSidebar, type ProjectTab } from "@/components/project-sidebar";
import { ProjectHeader } from "@/components/project-header";
import { getSessionUser } from "@/lib/session";
import { getProjectById, getProjectsForUser } from "@/db/queries";

const TABS: ProjectTab[] = [
  { label: "Dashboard", segment: "dashboard", icon: "LayoutDashboard" },
  { label: "Daily Reports", segment: "daily-reports", icon: "ClipboardList" },
  { label: "Project Graph", segment: "project-graph", icon: "Network" },
  { label: "Contractor Details", segment: "contractor-details", icon: "Building2" },
  { label: "Changes", segment: "changes", icon: "History" },
  // ANUBANDH additions (plan.md/update (1).md TASK 6, 10) — stakeholder-only views
  { label: "Financial", segment: "financial", icon: "Wallet" },
  { label: "Commitments", segment: "commitments", icon: "FileCheck2" },
  { label: "Notifications", segment: "notifications", icon: "Bell" },
  { label: "Settings", segment: "settings", icon: "Settings" },
];

export default async function StakeholderProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const basePath = `/stakeholder/project/${projectId}`;

  const project = getProjectById(projectId);
  if (!project) notFound();

  const user = await getSessionUser();
  if (user) {
    const allowed = getProjectsForUser(user.id).some((p) => p.id === projectId);
    if (!allowed) redirect("/stakeholder/projects");
  }

  return (
    <div className="flex flex-1 -m-8">
      <ProjectSidebar basePath={basePath} tabs={TABS} />
      <div className="flex flex-1 flex-col p-8">
        <ProjectHeader project={project} />
        {children}
      </div>
    </div>
  );
}
