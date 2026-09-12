import { Construction, type LucideIcon } from "lucide-react";

export function ComingSoon({
  title,
  icon: Icon = Construction,
}: {
  title: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-black/10 p-16 text-center dark:border-white/15">
      <Icon size={32} strokeWidth={1.5} className="text-zinc-400" />
      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
        {title}
      </h2>
      <p className="text-sm text-zinc-500">Coming soon</p>
    </div>
  );
}
