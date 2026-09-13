import { Construction, type LucideIcon } from "lucide-react";

export function ComingSoon({
  title,
  icon: Icon = Construction,
}: {
  title: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-indigo-200 p-16 text-center dark:border-indigo-800/50">
      <Icon size={32} strokeWidth={1.5} className="text-slate-400" />
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h2>
      <p className="text-sm text-slate-500">Coming soon</p>
    </div>
  );
}
