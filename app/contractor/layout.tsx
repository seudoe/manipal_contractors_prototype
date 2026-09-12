import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { RoleShell } from "@/components/role-shell";

export default async function ContractorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user || user.globalRole !== "CONTRACTOR") {
    redirect("/");
  }

  return (
    <RoleShell role="CONTRACTOR" userName={user.name}>
      {children}
    </RoleShell>
  );
}
