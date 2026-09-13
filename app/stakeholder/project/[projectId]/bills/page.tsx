import { notFound } from "next/navigation";
import { getProjectById, getBillsForContract } from "@/db/queries";
import { BillHistoryView } from "@/components/bill-history-view";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = getProjectById(projectId);
  if (!project) notFound();

  const bills = getBillsForContract(projectId);

  return <BillHistoryView bills={bills} projectId={projectId} />;
}
