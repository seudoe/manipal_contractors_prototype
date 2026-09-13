import { notFound } from "next/navigation";
import { CommitmentReviewTable } from "@/components/anubandh/commitment-review-table";
import { getCommitmentsForProject, getProjectById } from "@/db/queries";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = getProjectById(projectId);
  if (!project) notFound();

  const commitments = getCommitmentsForProject(projectId);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Commitment Review</h1>
        <p className="max-w-2xl text-sm text-slate-500">
          This is the only point where a human configures the system, and it takes about ten
          minutes per contract — every screen downstream just reads what gets set here.
        </p>
      </div>
      <CommitmentReviewTable commitments={commitments} />
    </div>
  );
}
