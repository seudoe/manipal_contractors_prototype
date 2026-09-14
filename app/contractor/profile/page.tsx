import { ProfileView } from "@/components/profile-view";
import { getSessionUser } from "@/lib/session";

export default async function Page() {
  const user = await getSessionUser();
  if (!user) return null;
  return <ProfileView userId={user.id} />;
}
