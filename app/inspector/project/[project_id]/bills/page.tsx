import { notFound } from "next/navigation";
import { getProjectById, getBillsForContract } from "@/db/queries";
import { BillHistoryView } from "@/components/bill-history-view";

export default async function Page({
  params,
}: {
  params: Promise<{ project_id: string }>;
}) {
  const { project_id } = await params;
  const project = getProjectById(project_id);
  if (!project) notFound();

  const bills = getBillsForContract(project_id);

  return <BillHistoryView bills={bills} projectId={project_id} />;
}
