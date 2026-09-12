import { ProjectGraphView } from "@/components/project-graph-view";

export default async function Page({
  params,
}: {
  params: Promise<{ project_id: string }>;
}) {
  const { project_id } = await params;
  return <ProjectGraphView projectId={project_id} />;
}
