import { cookies } from "next/headers";
import { findUserById, type User } from "@/lib/auth";

const SESSION_COOKIE = "session_user_id";

export async function getSessionUser(): Promise<User | undefined> {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return undefined;
  return findUserById(id);
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
