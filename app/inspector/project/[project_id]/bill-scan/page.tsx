import { notFound } from "next/navigation";
import { getProjectById, getBillScanScenarios } from "@/db/queries";
import { BillScanView } from "@/components/bill-scan-view";

export default async function Page({
  params,
}: {
  params: Promise<{ project_id: string }>;
}) {
  const { project_id } = await params;
  const project = getProjectById(project_id);
  if (!project) notFound();

  const scenarios = getBillScanScenarios();

  return <BillScanView scenarios={scenarios} projectId={project_id} />;
}
