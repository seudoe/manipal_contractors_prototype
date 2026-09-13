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
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/10 p-10 text-center dark:border-white/15">
      <Icon size={24} strokeWidth={1.5} className="text-zinc-400" />
      <p className="text-sm font-medium text-black dark:text-zinc-50">{title}</p>
      {description && <p className="text-xs text-zinc-500">{description}</p>}
    </div>
  );
}
