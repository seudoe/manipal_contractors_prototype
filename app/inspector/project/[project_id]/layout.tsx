import { ProjectSidebar } from "@/components/project-sidebar";

const TABS = [
  { label: "Changes", segment: "changes" },
  { label: "Graph", segment: "graph" },
];

export default async function InspectorProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ project_id: string }>;
}) {
  const { project_id } = await params;
  const basePath = `/inspector/project/${project_id}`;

  return (
    <div className="flex flex-1 -m-8">
      <ProjectSidebar basePath={basePath} tabs={TABS} />
      <div className="flex flex-1 flex-col p-8">{children}</div>
    </div>
  );
}
