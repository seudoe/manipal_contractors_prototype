import { ProjectSidebar } from "@/components/project-sidebar";

const TABS = [
  { label: "Dashboard", segment: "dashboard" },
  { label: "Daily Reports", segment: "daily-reports" },
  { label: "Project Graph", segment: "project-graph" },
  { label: "Contractor Details", segment: "contractor-details" },
  { label: "Changes", segment: "changes" },
  { label: "Notifications", segment: "notifications" },
  { label: "Settings", segment: "settings" },
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

  return (
    <div className="flex flex-1 -m-8">
      <ProjectSidebar basePath={basePath} tabs={TABS} />
      <div className="flex flex-1 flex-col p-8">{children}</div>
    </div>
  );
}
