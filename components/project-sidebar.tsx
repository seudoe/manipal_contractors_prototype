"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Network,
  Users,
  Building2,
  History,
  Bell,
  Settings,
  AlertTriangle,
  Wallet,
  FileCheck2,
  Activity,
  Image,
  ScanLine,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";

const ICONS = {
  LayoutDashboard,
  ClipboardList,
  Network,
  Users,
  Building2,
  History,
  Bell,
  Settings,
  // ANUBANDH additions (plan.md/update (1).md) — new keys only, existing keys untouched
  AlertTriangle,
  Wallet,
  FileCheck2,
  Activity,
  Image,
  ScanLine,
  ReceiptText,
} satisfies Record<string, LucideIcon>;

export type ProjectTabIcon = keyof typeof ICONS;

export interface ProjectTab {
  label: string;
  segment: string;
  icon: ProjectTabIcon;
}

export function ProjectSidebar({
  basePath,
  tabs,
}: {
  basePath: string;
  tabs: ProjectTab[];
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 flex-col gap-1 border-r border-black/10 bg-white px-4 py-6 dark:border-white/10 dark:bg-zinc-950">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
        Project
      </p>
      {tabs.map((tab) => {
        const href = tab.segment ? `${basePath}/${tab.segment}` : basePath;
        const active = pathname === href;
        const Icon = ICONS[tab.icon];
        return (
          <Link
            key={tab.label}
            href={href}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            }`}
          >
            <Icon size={18} strokeWidth={2} />
            {tab.label}
          </Link>
        );
      })}
    </aside>
  );
}
