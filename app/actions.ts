"use server";

import { redirect } from "next/navigation";
import type { GlobalRole } from "@/types/user";
import { findUserByEmail, createUser, getUsers } from "@/db/queries";
import { setSessionUser, clearSessionUser, roleHomePath } from "@/lib/session";

export interface AuthFormState {
  error?: string;
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return { error: "Invalid email or password." };
  }

  await setSessionUser(user.id);
  redirect(roleHomePath(user.globalRole));
}

export async function register(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const globalRole = String(formData.get("global_role") ?? "") as GlobalRole;

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }
  if (!["STAKEHOLDER", "CONTRACTOR", "INSPECTOR"].includes(globalRole)) {
    return { error: "Please choose a role." };
  }
  if (findUserByEmail(email)) {
    return { error: "An account with that email already exists." };
  }

  const newUser = createUser({ name, email, password, globalRole });

  await setSessionUser(newUser.id);
  redirect(roleHomePath(newUser.globalRole));
}

export async function quickLogin(role: GlobalRole) {
  const user = getUsers().find((u) => u.globalRole === role);
  if (!user) return;

  await setSessionUser(user.id);
  redirect(roleHomePath(user.globalRole));
}

export async function logout() {
  await clearSessionUser();
  redirect("/");
}
