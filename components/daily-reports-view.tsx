import { getDailyReports, getUserById } from "@/db/queries";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  SUBMITTED: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  REVIEWED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

/** spec section 19/20 — daily reports. Demo placeholder: same 3 reports on every project. */
export function DailyReportsView() {
  const reports = getDailyReports();

  return (
    <div className="flex flex-col gap-3">
      {reports.map((report) => {
        const author = getUserById(report.submittedBy);
        return (
          <div
            key={report.id}
            className="flex flex-col gap-3 rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-800/40 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {new Date(report.reportDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-slate-500">
                  Submitted by {author?.name ?? report.submittedBy}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  STATUS_STYLES[report.status] ?? STATUS_STYLES.DRAFT
                }`}
              >
                {report.status}
              </span>
            </div>

            {report.summary && (
              <p className="text-sm text-slate-600 dark:text-slate-300">{report.summary}</p>
            )}

            <div className="grid grid-cols-2 gap-3 border-t border-black/5 pt-3 text-xs sm:grid-cols-3 dark:border-white/5">
              {report.progress !== undefined && (
                <Field label="Progress" value={`${report.progress}%`} />
              )}
              {report.currentCost !== undefined && (
                <Field label="Current Cost" value={`INR ${report.currentCost.toLocaleString()}`} />
              )}
              {report.expectedCompletionDate && (
                <Field label="Expected Completion" value={report.expectedCompletionDate} />
              )}
            </div>

            {report.issues && (
              <p className="text-xs text-slate-500">
                <span className="font-medium text-slate-600 dark:text-slate-300">Issues: </span>
                {report.issues}
              </p>
            )}
            {report.nextSteps && (
              <p className="text-xs text-slate-500">
                <span className="font-medium text-slate-600 dark:text-slate-300">Next steps: </span>
                {report.nextSteps}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-slate-400">{label}</p>
      <p className="font-medium text-slate-700 dark:text-slate-300">{value}</p>
    </div>
  );
}
