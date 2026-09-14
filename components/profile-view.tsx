import { Mail, CalendarDays, ShieldCheck, Building2 } from "lucide-react";
import { getUserById, getContractorByUserId } from "@/db/queries";

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ProfileView({ userId }: { userId: string }) {
  const user = getUserById(userId);
  if (!user) return null;

  const contractor = user.globalRole === "CONTRACTOR" ? getContractorByUserId(userId) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 rounded-xl border border-indigo-200 bg-white p-6 dark:border-indigo-800/40 dark:bg-slate-900">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xl font-semibold text-white">
          {initials(user.name)}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            {user.name}
          </h1>
          <span className="mt-1 inline-block rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {user.globalRole}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InfoCard icon={Mail} label="Email" value={user.email} />
        <InfoCard icon={ShieldCheck} label="Role" value={user.globalRole} />
        <InfoCard
          icon={CalendarDays}
          label="Member since"
          value={new Date(user.createdAt).toLocaleDateString()}
        />
      </div>

      {contractor && (
        <div className="rounded-xl border border-indigo-200 bg-white p-6 dark:border-indigo-800/40 dark:bg-slate-900">
          <div className="mb-3 flex items-center gap-2">
            <Building2 size={18} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Organization
            </h2>
          </div>
          <p className="font-medium text-slate-900 dark:text-slate-50">{contractor.name}</p>
          {contractor.description && (
            <p className="mt-1 text-sm text-slate-500">{contractor.description}</p>
          )}
        </div>
      )}
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-800/40 dark:bg-slate-900">
      <Icon size={20} className="mt-0.5 shrink-0 text-slate-400" />
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-0.5 font-semibold text-slate-900 dark:text-slate-50">{value}</p>
      </div>
    </div>
  );
}
