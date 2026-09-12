import { ProjectStakeholdersView } from "@/components/project-stakeholders-view";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectStakeholdersView projectId={projectId} />;
}
