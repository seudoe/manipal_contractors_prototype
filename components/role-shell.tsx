"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions";
import type { GlobalRole } from "@/lib/auth";

const GLOBAL_NAV = [
  { label: "Projects", segment: "projects" },
  { label: "Profile", segment: "profile" },
  { label: "Settings", segment: "settings" },
  { label: "Notifications", segment: "notifications" },
];

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
  const inProject = pathname.includes(`${base}/project/`);

  return (
    <div className="flex flex-1">
      <aside
        className={`flex flex-col justify-between border-r border-black/10 bg-white py-6 dark:border-white/10 dark:bg-zinc-950 ${
          inProject ? "w-16 items-center px-2" : "w-56 px-4"
        }`}
      >
        <div className="flex flex-col gap-6">
          {!inProject && (
            <div className="px-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {role}
              </p>
              <p className="truncate text-sm font-medium text-black dark:text-zinc-50">
                {userName}
              </p>
            </div>
          )}
          <nav className="flex flex-col gap-1">
            {GLOBAL_NAV.map((item) => {
              const href = `${base}/${item.segment}`;
              const active = pathname === href;
              return (
                <Link
                  key={item.segment}
                  href={href}
                  title={item.label}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    inProject ? "text-center" : ""
                  } ${
                    active
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  }`}
                >
                  {inProject ? item.label.charAt(0) : item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {inProject ? "⏻" : "Log out"}
          </button>
        </form>
      </aside>
      <main className="flex flex-1 flex-col p-8">{children}</main>
    </div>
  );
}
