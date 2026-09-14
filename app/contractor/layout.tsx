import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getContractorByUserId } from "@/db/queries";
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

  const contractor = getContractorByUserId(user.id);

  return (
    <RoleShell role="CONTRACTOR" userName={user.name} orgName={contractor?.name}>
      {children}
    </RoleShell>
  );
}
