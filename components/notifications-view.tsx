import { Bell } from "lucide-react";
import { getNotificationsForUser } from "@/db/queries";

export function NotificationsView({ userId }: { userId: string }) {
  const notifications = getNotificationsForUser(userId);

  if (notifications.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-indigo-200 p-16 text-center dark:border-indigo-800/50">
        <Bell size={32} strokeWidth={1.5} className="text-slate-400" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Notifications
        </h2>
        <p className="text-sm text-slate-500">You&apos;re all caught up.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex flex-col gap-1 rounded-xl border p-4 dark:bg-slate-900 ${
            n.readAt
              ? "border-indigo-200 bg-white dark:border-indigo-800/40"
              : "border-indigo-400 bg-indigo-50 dark:border-indigo-600"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {n.title}
            </p>
            <span className="shrink-0 text-xs text-slate-400">
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">{n.message}</p>
        </div>
      ))}
    </div>
  );
}
