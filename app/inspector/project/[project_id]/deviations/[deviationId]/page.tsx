import { notFound } from "next/navigation";
import Link from "next/link";
import { LevelBadge } from "@/components/anubandh/level-badge";
import { TimeRemaining } from "@/components/anubandh/time-remaining";
import { PromisedVsObserved } from "@/components/anubandh/promised-vs-observed";
import { TrustNote } from "@/components/anubandh/trust-note";
import { PriorityPanel } from "@/components/anubandh/priority-panel";
import { RequestEvidenceButton } from "@/components/anubandh/request-evidence-button";
import { EvidenceLightbox } from "@/components/anubandh/evidence-lightbox";
import { ExternalLink } from "lucide-react";
import { getDeviationById, getObservationById, getExpectationById, getBillsForContract } from "@/db/queries";

export default async function Page({
  params,
}: {
  params: Promise<{ project_id: string; deviationId: string }>;
}) {
  const { project_id, deviationId } = await params;
  const deviation = getDeviationById(deviationId);
  if (!deviation || deviation.projectId !== project_id) notFound();

  const observation = deviation.observationId ? getObservationById(deviation.observationId) : undefined;
  const expectation = deviation.expectationId ? getExpectationById(deviation.expectationId) : undefined;
  const isSilence = deviation.kind === "SILENCE";

  const contributing = deviation.contributingDeviationIds
    .map((id) => getDeviationById(id))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const linkedBill = getBillsForContract(project_id).find((b) => b.linkedIssueId === deviationId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 border-b border-black/10 pb-4 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-3">
          <LevelBadge level={deviation.level} />
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {deviation.status.replaceAll("_", " ")}
          </span>
          <TimeRemaining value={deviation.timeRemaining} />
        </div>
        <h1 className="text-xl font-semibold text-black dark:text-zinc-50">{deviation.title}</h1>
        {deviation.valueAtRisk > 0 && (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Value at risk:{" "}
            <span className="font-semibold text-black dark:text-white">
              Rs {deviation.valueAtRisk.toLocaleString("en-IN")}
            </span>
          </p>
        )}
      </div>

      <PromisedVsObserved
        promisedText={deviation.promisedText}
        observedText={deviation.observedText}
        silence={isSilence}
      />

      {linkedBill && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-black/10 bg-zinc-50/70 p-4 dark:border-white/10 dark:bg-zinc-900/40">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Originating tax invoice
            </p>
            <p className="text-sm font-medium text-black dark:text-zinc-50">
              Invoice <span className="font-mono">{linkedBill.invoiceNumber}</span> ({linkedBill.supplierName})
            </p>
            <p className="text-xs text-zinc-500">
              Delivered on {linkedBill.invoiceDate} • Rs {linkedBill.totalValue.toLocaleString("en-IN")}
            </p>
          </div>
          <Link
            href={`/inspector/project/${project_id}/bills`}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            View in invoice history
            <ExternalLink size={12} />
          </Link>
        </div>
      )}

      {isSilence ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            What should have arrived
          </p>
          {expectation ? (
            <div className="mt-2 flex flex-col gap-1 text-sm">
              <p className="font-medium text-black dark:text-zinc-50">{expectation.expectedLabel}</p>
              <p className="text-zinc-500">Expected type: {expectation.expectedType.replaceAll("_", " ")}</p>
              <p className="text-zinc-500">Due: {expectation.dueLabel}</p>
              {expectation.overdueLabel && (
                <p className="font-medium text-red-600 dark:text-red-400">{expectation.overdueLabel}</p>
              )}
              <Link
                href={`/inspector/project/${project_id}/expectations`}
                className="mt-1 w-fit text-xs text-black underline dark:text-zinc-50"
              >
                View in Expectations
              </Link>
            </div>
          ) : (
            <p className="mt-2 text-sm text-zinc-500">No linked expectation on file.</p>
          )}
        </div>
      ) : (
        observation && (
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <TrustNote
                sourceType={observation.sourceType}
                trustLabel={observation.trustLabel}
                trustScore={observation.trustScore}
              />
            </div>
            {observation.sourceType === "SITE_PHOTO" && <EvidenceLightbox observation={observation} />}
          </div>
        )
      )}

      <PriorityPanel factors={deviation.priorityFactors} priority={deviation.priority} />

      {deviation.reasons.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Reasons</p>
          <ul className="flex flex-col gap-1.5 text-sm">
            {deviation.reasons.map((reason) => (
              <li key={reason} className="flex gap-2 text-zinc-700 dark:text-zinc-300">
                <span className="select-none text-zinc-400">-</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {deviation.kind === "PROMOTED" && contributing.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Contributing deviations
          </p>
          <p className="mb-3 text-xs text-zinc-500">
            Individually harmless changes, read together — each row below was filed on its own as
            cosmetic, but the pattern across all of them is what earns this case an L2.
          </p>
          <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-400 dark:border-white/10 dark:bg-zinc-900">
                  <th className="px-4 py-2 font-medium">Title</th>
                  <th className="px-4 py-2 font-medium">Level</th>
                  <th className="px-4 py-2 font-medium">Value at risk</th>
                </tr>
              </thead>
              <tbody>
                {contributing.map((c) => (
                  <tr key={c.id} className="border-b border-black/5 last:border-0 dark:border-white/5">
                    <td className="px-4 py-2 text-black dark:text-zinc-50">{c.title}</td>
                    <td className="px-4 py-2">
                      <LevelBadge level={c.level} size="sm" />
                    </td>
                    <td className="px-4 py-2 text-zinc-600 dark:text-zinc-300">
                      Rs {c.valueAtRisk.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {deviation.cumulativeValue != null && (
            <p className="mt-2 text-sm font-medium text-black dark:text-zinc-50">
              Cumulative value: Rs {deviation.cumulativeValue.toLocaleString("en-IN")}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/10">
        <Link
          href={`/inspector/project/${project_id}/deviations`}
          className="text-sm text-zinc-500 hover:underline"
        >
          Back to queue
        </Link>
        <RequestEvidenceButton />
      </div>
    </div>
  );
}
