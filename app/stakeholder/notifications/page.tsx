import { NotificationsView } from "@/components/notifications-view";
import { getSessionUser } from "@/lib/session";

export default async function Page() {
  const user = await getSessionUser();
  if (!user) return null;
  return <NotificationsView userId={user.id} />;
}
