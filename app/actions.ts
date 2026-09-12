"use server";

import { redirect } from "next/navigation";
import {
  findUserByEmail,
  roleHomePath,
  users,
  type GlobalRole,
} from "@/lib/auth";
import { setSessionUser, clearSessionUser } from "@/lib/session";

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
  redirect(roleHomePath(user.global_role));
}

export async function register(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const global_role = String(formData.get("global_role") ?? "") as GlobalRole;

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }
  if (!["STAKEHOLDER", "CONTRACTOR", "INSPECTOR"].includes(global_role)) {
    return { error: "Please choose a role." };
  }
  if (findUserByEmail(email)) {
    return { error: "An account with that email already exists." };
  }

  const now = new Date().toISOString();
  const newUser = {
    id: `u-${users.length + 1}`,
    email,
    name,
    avatar_url: null,
    global_role,
    password,
    created_at: now,
    updated_at: now,
  };
  users.push(newUser);

  await setSessionUser(newUser.id);
  redirect(roleHomePath(newUser.global_role));
}

export async function quickLogin(role: GlobalRole) {
  const user = users.find((u) => u.global_role === role);
  if (!user) return;

  await setSessionUser(user.id);
  redirect(roleHomePath(user.global_role));
}

export async function logout() {
  await clearSessionUser();
  redirect("/");
}
