import {
  Wallet,
  CalendarDays,
  CalendarClock,
  TrendingUp,
  Layers,
  History,
  Hourglass,
} from "lucide-react";
import {
  getProjectById,
  getProjectOverallProgress,
  getActiveFeatureCount,
  getProjectChanges,
} from "@/db/queries";

/**
 * spec: project_coding_spec.md section 47 (Main Project Dashboard Data Flow)
 * Cards: Contract Value, Original Deadline, Current Deadline, Overall
 * Progress, Active Features, Significant Changes, Pending Reviews.
 */
export function ProjectDashboard({ projectId }: { projectId: string }) {
  const project = getProjectById(projectId);
  if (!project) return null;

  const progress = getProjectOverallProgress(projectId);
  const activeFeatures = getActiveFeatureCount(projectId);
  const changes = getProjectChanges(projectId);
  const pendingReviews = changes.filter((c) => c.status === "PENDING").length;

  const cards = [
    {
      label: "Contract Value",
      value: `${project.currency} ${project.contractValue.toLocaleString()}`,
      icon: Wallet,
    },
    {
      label: "Original Deadline",
      value: project.originalCompletionDate ?? "—",
      icon: CalendarDays,
    },
    {
      label: "Current Deadline",
      value: project.currentExpectedCompletionDate ?? "—",
      icon: CalendarClock,
    },
    {
      label: "Overall Progress",
      value: `${progress}%`,
      icon: TrendingUp,
    },
    {
      label: "Active Features",
      value: String(activeFeatures),
      icon: Layers,
    },
    {
      label: "Significant Changes",
      value: String(changes.length),
      icon: History,
    },
    {
      label: "Pending Reviews",
      value: String(pendingReviews),
      icon: Hourglass,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="flex items-start gap-3 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900"
        >
          <Icon size={20} className="mt-0.5 shrink-0 text-zinc-400" />
          <div>
            <p className="text-xs font-medium text-zinc-500">{label}</p>
            <p className="mt-0.5 font-semibold text-black dark:text-zinc-50">
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
