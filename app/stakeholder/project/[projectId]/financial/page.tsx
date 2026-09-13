import { notFound } from "next/navigation";
import { EmptyState } from "@/components/anubandh/empty-state";
import { FinancialView } from "@/components/anubandh/financial-view";
import { getFinancialForProject, getProjectById } from "@/db/queries";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  if (!getProjectById(projectId)) notFound();

  const financial = getFinancialForProject(projectId);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-black dark:text-zinc-50">Financial</h1>
      {financial ? (
        <FinancialView financial={financial} readOnly />
      ) : (
        <EmptyState
          title="No financial data seeded for this project yet"
          description="This demo dataset only authors financial figures for a subset of projects."
        />
      )}
    </div>
  );
}
