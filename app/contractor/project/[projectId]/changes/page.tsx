import { ProjectChangesView } from "@/components/project-changes-view";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectChangesView projectId={projectId} />;
}
