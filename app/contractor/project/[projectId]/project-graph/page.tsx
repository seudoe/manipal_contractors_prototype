import { ProjectGraphView } from "@/components/project-graph-view";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectGraphView projectId={projectId} />;
}
