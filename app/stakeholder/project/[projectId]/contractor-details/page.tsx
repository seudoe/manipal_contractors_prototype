import { ProjectContractorDetailsView } from "@/components/project-contractor-details-view";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectContractorDetailsView projectId={projectId} />;
}
