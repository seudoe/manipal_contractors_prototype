import type { DailyReport } from "@/types/report";

/**
 * 3 demo daily reports, shown as-is on every project's Daily Reports tab —
 * not filtered by projectId (see db/queries.ts#getDailyReports). Good
 * enough for demo purposes; wire up real per-project filtering (reportDate,
 * projectId match) once this needs to be more than a placeholder.
 */
export const dailyReports: DailyReport[] = [
  {
    id: "report-1",
    projectId: "project-1",
    submittedBy: "user-ct-1",
    reportDate: "2026-09-10",
    summary: "Elevated track structure formwork completed for stations 2 and 3; concrete pour scheduled next week.",
    progress: 60,
    currentCost: 312_000_000,
    expectedCompletionDate: "2027-04-15",
    issues: "Precast segment delivery running about a week behind due to supplier capacity constraints.",
    nextSteps: "Begin concrete pour at station 2 once formwork inspection is signed off.",
    status: "SUBMITTED",
    createdAt: "2026-09-10T09:00:00.000Z",
    updatedAt: "2026-09-10T09:00:00.000Z",
  },
  {
    id: "report-2",
    projectId: "project-1",
    submittedBy: "user-ct-3",
    reportDate: "2026-09-08",
    summary: "OPD block structural work on floor 4 complete; plumbing rough-in underway on floors 1-2.",
    progress: 70,
    currentCost: 228_500_000,
    expectedCompletionDate: "2026-12-31",
    issues: "None outstanding this period.",
    nextSteps: "Start floor 5 formwork; coordinate MRI suite site prep with equipment vendor.",
    status: "REVIEWED",
    createdAt: "2026-09-08T09:00:00.000Z",
    updatedAt: "2026-09-09T14:30:00.000Z",
  },
  {
    id: "report-3",
    projectId: "project-1",
    submittedBy: "user-ct-2",
    reportDate: "2026-09-12",
    summary: "Traction power wiring pull-through complete for the first two stations; signaling cabinet install in progress.",
    progress: 40,
    currentCost: 41_200_000,
    expectedCompletionDate: "2026-11-01",
    issues: "Awaiting SCADA vendor confirmation for cabinet commissioning window.",
    nextSteps: "Complete cabinet install at station 3, begin cable termination testing.",
    status: "DRAFT",
    createdAt: "2026-09-12T16:45:00.000Z",
    updatedAt: "2026-09-12T16:45:00.000Z",
  },
];
