import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { RoleShell } from "@/components/role-shell";

export default async function InspectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user || user.globalRole !== "INSPECTOR") {
    redirect("/");
  }

  return (
    <RoleShell role="INSPECTOR" userName={user.name}>
      {children}
    </RoleShell>
  );
}
