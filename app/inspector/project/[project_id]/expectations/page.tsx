import { notFound } from "next/navigation";
import { AlertCircle } from "lucide-react";
import {
  getExpectationsForProject,
  getCommitmentById,
  getProjectById,
  getImpliedEvidenceForProject,
  getContractorById,
} from "@/db/queries";
import type { Expectation, ExpectationStatus } from "@/types/observation";
import { EmptyState } from "@/components/anubandh/empty-state";

/**
 * ANUBANDH — the missing-evidence / silence screen (TASK 7). All figures in
 * the "Implied evidence" panel are hardcoded on the record, not computed
 * from the delivery data at runtime.
 */
const GROUP_ORDER: ExpectationStatus[] = ["MISSING", "PENDING", "MET"];
const GROUP_LABEL: Record<ExpectationStatus, string> = {
  MISSING: "Missing",
  PENDING: "Pending",
  MET: "Met",
};

export default async function Page({
  params,
}: {
  params: Promise<{ project_id: string }>;
}) {
  const { project_id } = await params;
  const project = getProjectById(project_id);
  if (!project) notFound();

  const expectations = getExpectationsForProject(project_id);
  const impliedEvidence = getImpliedEvidenceForProject(project_id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-black dark:text-zinc-50">Expectations</h1>

      {impliedEvidence && (
        <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Implied evidence
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Metric label={impliedEvidence.deliveredLabel} value={impliedEvidence.deliveredValue} />
            <Metric label={impliedEvidence.expectedTestsLabel} value={impliedEvidence.expectedTestsValue} />
            <Metric label={impliedEvidence.onFileLabel} value={impliedEvidence.onFileValue} />
            <Metric
              label={impliedEvidence.shortfallLabel}
              value={impliedEvidence.shortfallValue}
              tone="text-red-600 dark:text-red-400"
            />
          </div>
          <p className="mt-3 text-xs text-zinc-500">{impliedEvidence.caption}</p>
        </div>
      )}

      {expectations.length === 0 && (
        <EmptyState
          title="No expectations seeded for this project yet"
          description="This demo dataset only authors expectations for a subset of projects."
        />
      )}

      {GROUP_ORDER.map((status) => {
        const rows = expectations.filter((e) => e.status === status);
        if (rows.length === 0) return null;
        return (
          <div key={status}>
            <p
              className={`mb-2 text-xs font-semibold uppercase tracking-wide ${
                status === "MISSING" ? "text-red-500" : "text-zinc-400"
              }`}
            >
              {GROUP_LABEL[status]} ({rows.length})
            </p>
            <div className="flex flex-col gap-2">
              {rows.map((exp) => (
                <ExpectationRow key={exp.id} expectation={exp} dominant={status === "MISSING"} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`text-lg font-semibold ${tone ?? "text-black dark:text-zinc-50"}`}>{value}</p>
    </div>
  );
}

function ExpectationRow({ expectation, dominant }: { expectation: Expectation; dominant: boolean }) {
  const commitment = getCommitmentById(expectation.commitmentId);
  const actor = commitment ? getContractorById(commitment.actorContractorId) : undefined;
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 ${
        dominant
          ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950"
          : "border-black/10 bg-white dark:border-white/10 dark:bg-zinc-900"
      }`}
    >
      <div className="flex items-start gap-2">
        {dominant && <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" />}
        <div>
          <p className="text-sm font-medium text-black dark:text-zinc-50">{expectation.expectedLabel}</p>
          <p className="text-xs text-zinc-500">
            From {actor?.name ?? "unknown party"} — due {expectation.dueLabel}
          </p>
        </div>
      </div>
      {expectation.overdueLabel && (
        <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
          {expectation.overdueLabel}
        </span>
      )}
    </div>
  );
}
