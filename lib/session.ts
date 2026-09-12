import { cookies } from "next/headers";
import type { User, GlobalRole } from "@/types/user";
import { getUserById } from "@/db/queries";

const SESSION_COOKIE = "session_user_id";

export async function getSessionUser(): Promise<User | undefined> {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return undefined;
  return getUserById(id);
}

export async function setSessionUser(userId: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSessionUser() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export function roleHomePath(role: GlobalRole): string {
  return `/${role.toLowerCase()}/projects`;
}
