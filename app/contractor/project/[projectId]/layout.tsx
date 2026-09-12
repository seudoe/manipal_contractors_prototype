import { ProjectSidebar } from "@/components/project-sidebar";

const TABS = [
  { label: "Dashboard", segment: "dashboard" },
  { label: "Daily Reports", segment: "daily-reports" },
  { label: "Project Graph", segment: "project-graph" },
  { label: "Stakeholder Details", segment: "stakeholder-details" },
  { label: "Subcontractors", segment: "subcontractors" },
  { label: "Changes", segment: "changes" },
  { label: "Notifications", segment: "notifications" },
  { label: "Settings", segment: "settings" },
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

  return (
    <div className="flex flex-1 -m-8">
      <ProjectSidebar basePath={basePath} tabs={TABS} />
      <div className="flex flex-1 flex-col p-8">{children}</div>
    </div>
  );
}
