import { notFound } from "next/navigation";
import { getProjectById, getBillScanScenarios } from "@/db/queries";
import { BillScanView } from "@/components/bill-scan-view";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = getProjectById(projectId);
  if (!project) notFound();

  const scenarios = getBillScanScenarios();

  return <BillScanView scenarios={scenarios} projectId={projectId} />;
}
