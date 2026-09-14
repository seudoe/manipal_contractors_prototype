import { NewProjectEditor } from "@/components/new-project/new-project-editor";
import { getSessionUser } from "@/lib/session";

export default async function Page() {
  const user = await getSessionUser();
  if (!user) return null;
  return <NewProjectEditor email={user.email} />;
}
