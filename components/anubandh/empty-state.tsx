import { Inbox, type LucideIcon } from "lucide-react";

/**
 * ANUBANDH shared primitive — a generic "no rows match" empty state,
 * distinct from components/coming-soon.tsx (which is for entire pages with
 * no data model yet, not for a filtered-to-empty list).
 */
export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-200 p-10 text-center dark:border-indigo-800/50">
      <Icon size={24} strokeWidth={1.5} className="text-slate-400" />
      <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{title}</p>
      {description && <p className="text-xs text-slate-500">{description}</p>}
    </div>
  );
}
