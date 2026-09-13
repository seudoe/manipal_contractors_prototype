import { notFound } from "next/navigation";
import { ProjectSidebar, type ProjectTab } from "@/components/project-sidebar";
import { ProjectHeader } from "@/components/project-header";
import { getProjectById } from "@/db/queries";

const TABS: ProjectTab[] = [
  { label: "Changes", segment: "changes", icon: "History" },
  { label: "Graph", segment: "graph", icon: "Network" },
  // ANUBANDH additions (plan.md/update (1).md TASK 4/6/7) — inspector-only tabs
  { label: "Deviations", segment: "deviations", icon: "AlertTriangle" },
  { label: "Expectations", segment: "expectations", icon: "FileCheck2" },
  { label: "Financial", segment: "financial", icon: "Wallet" },
  // ANUBANDH additions (timeline + evidence viewer)
  { label: "Timeline", segment: "timeline", icon: "Activity" },
  { label: "Evidence", segment: "evidence", icon: "Image" },
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

  const project = getProjectById(project_id);
  if (!project) notFound();

  // Inspectors aren't scoped to specific projects in the spec (no
  // inspector<->project link table yet), so no access check here — see
  // getProjectsForUser's note in db/queries.ts.

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
