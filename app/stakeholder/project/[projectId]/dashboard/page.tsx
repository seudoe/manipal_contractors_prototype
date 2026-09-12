import { ProjectDashboard } from "@/components/project-dashboard";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectDashboard projectId={projectId} />;
}
