import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { RoleShell } from "@/components/role-shell";

export default async function StakeholderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user || user.globalRole !== "STAKEHOLDER") {
    redirect("/");
  }

  return (
    <RoleShell role="STAKEHOLDER" userName={user.name}>
      {children}
    </RoleShell>
  );
}
