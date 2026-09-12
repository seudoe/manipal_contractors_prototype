import { ProjectChangesView } from "@/components/project-changes-view";

export default async function Page({
  params,
}: {
  params: Promise<{ project_id: string }>;
}) {
  const { project_id } = await params;
  return <ProjectChangesView projectId={project_id} />;
}
