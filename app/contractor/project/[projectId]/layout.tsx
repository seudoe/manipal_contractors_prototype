import { notFound, redirect } from "next/navigation";
import { ProjectSidebar, type ProjectTab } from "@/components/project-sidebar";
import { ProjectHeader } from "@/components/project-header";
import { getSessionUser } from "@/lib/session";
import { getProjectById, getProjectsForUser } from "@/db/queries";

const TABS: ProjectTab[] = [
  { label: "Dashboard", segment: "dashboard", icon: "LayoutDashboard" },
  { label: "Daily Reports", segment: "daily-reports", icon: "ClipboardList" },
  { label: "Project Graph", segment: "project-graph", icon: "Network" },
  { label: "Stakeholder Details", segment: "stakeholder-details", icon: "Users" },
  { label: "Subcontractors", segment: "subcontractors", icon: "Building2" },
  { label: "Changes", segment: "changes", icon: "History" },
  { label: "Bill Scan", segment: "bill-scan", icon: "ScanLine" },
  { label: "Invoices", segment: "bills", icon: "ReceiptText" },
  { label: "Notifications", segment: "notifications", icon: "Bell" },
  { label: "Settings", segment: "settings", icon: "Settings" },
];

export default async function ContractorProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const basePath = `/contractor/project/${projectId}`;

  const project = getProjectById(projectId);
  if (!project) notFound();

  const user = await getSessionUser();
  if (user) {
    const allowed = getProjectsForUser(user.id).some((p) => p.id === projectId);
    if (!allowed) redirect("/contractor/projects");
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
