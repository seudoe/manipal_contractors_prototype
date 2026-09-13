import { notFound } from "next/navigation";
import { EmptyState } from "@/components/anubandh/empty-state";
import { FinancialView } from "@/components/anubandh/financial-view";
import { getFinancialForProject, getProjectById } from "@/db/queries";

export default async function Page({
  params,
}: {
  params: Promise<{ project_id: string }>;
}) {
  const { project_id } = await params;
  if (!getProjectById(project_id)) notFound();

  const financial = getFinancialForProject(project_id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Financial</h1>
      {financial ? (
        <FinancialView financial={financial} />
      ) : (
        <EmptyState
          title="No financial data seeded for this project yet"
          description="This demo dataset only authors financial figures for a subset of projects."
        />
      )}
    </div>
  );
}
