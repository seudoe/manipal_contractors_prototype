"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  UserCircle,
  Settings,
  Bell,
  LogOut,
  AlertTriangle,
  Share2,
  FileWarning,
  type LucideIcon,
} from "lucide-react";
import { logout } from "@/app/actions";
import type { GlobalRole } from "@/types/user";

const GLOBAL_NAV = [
  { label: "Projects", segment: "projects", icon: FolderKanban },
  { label: "Profile", segment: "profile", icon: UserCircle },
  { label: "Settings", segment: "settings", icon: Settings },
  { label: "Notifications", segment: "notifications", icon: Bell },
];

/**
 * ANUBANDH addition (plan.md/update (1).md TASK 4/5/8) — extra top-level
 * nav entries, scoped per role so GLOBAL_NAV's existing behaviour for
 * CONTRACTOR/STAKEHOLDER is untouched (they get an empty array here).
 */
const EXTRA_NAV: Partial<
  Record<GlobalRole, { label: string; segment: string; icon: LucideIcon }[]>
> = {
  INSPECTOR: [
    { label: "Deviations", segment: "deviations", icon: AlertTriangle },
    { label: "Override Audit", segment: "override-audit", icon: FileWarning },
    { label: "Collusion", segment: "collusion", icon: Share2 },
  ],
};

export function RoleShell({
  role,
  userName,
  children,
}: {
  role: GlobalRole;
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const base = `/${role.toLowerCase()}`;
  
  // inProject is no longer used for width, but we can keep it if needed.
  // The global sidebar is always w-16 normally, expanding to w-56 on hover.

  return (
    <div className="flex flex-1 relative">
      {/* Spacer to push main content to the right so it doesn't get covered by the collapsed sidebar */}
      <div className="w-16 shrink-0" />

      <aside
        className="group absolute bottom-0 left-0 top-0 z-50 flex w-16 flex-col justify-between overflow-hidden border-r border-indigo-900 bg-indigo-950 py-6 transition-[width] duration-300 hover:w-56"
      >
        <div className="flex w-56 flex-col gap-6 px-3">
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-900">
              <UserCircle size={24} className="text-indigo-300" />
            </div>
            <div className="flex flex-col opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400/80">
                {role}
              </p>
              <p className="truncate text-sm font-medium text-white">
                {userName}
              </p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-1">
            {[...GLOBAL_NAV, ...(EXTRA_NAV[role] ?? [])].map((item) => {
              const href = `${base}/${item.segment}`;
              const active = pathname === href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.segment}
                  href={href}
                  title={item.label}
                  className={`flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-indigo-600 text-white"
                      : "text-indigo-200 hover:bg-indigo-900 hover:text-white"
                  }`}
                >
                  <Icon size={20} strokeWidth={2} className="shrink-0" />
                  <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex w-56 flex-col px-3">
          <form action={logout}>
            <button
              type="submit"
              title="Log out"
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium text-indigo-300 transition-colors hover:bg-indigo-900 hover:text-white"
            >
              <LogOut size={20} strokeWidth={2} className="shrink-0" />
              <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Log out
              </span>
            </button>
          </form>
        </div>
      </aside>
      
      <main className="flex flex-1 flex-col p-8">{children}</main>
    </div>
  );
}
