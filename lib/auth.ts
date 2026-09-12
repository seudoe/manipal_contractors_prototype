// Hardcoded "database" for the prototype. No real DB/auth yet — see
// project_coding_spec.md section 4 for the real `users` table shape.
// `password` is prototype-only and is NOT part of the real schema.

export type GlobalRole = "STAKEHOLDER" | "CONTRACTOR" | "INSPECTOR";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  global_role: GlobalRole;
  password: string;
  created_at: string;
  updated_at: string;
}

// module-level array acting as our in-memory "table" — mutated by register()
export const users: User[] = [
  {
    id: "u-1",
    email: "owner@stakeholder.com",
    name: "Ananya Rao",
    avatar_url: null,
    global_role: "STAKEHOLDER",
    password: "password",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "u-2",
    email: "lead@contractor.com",
    name: "Vikram Shah",
    avatar_url: null,
    global_role: "CONTRACTOR",
    password: "password",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "u-3",
    email: "inspector@quality.com",
    name: "Meera Iyer",
    avatar_url: null,
    global_role: "INSPECTOR",
    password: "password",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
];

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function roleHomePath(role: GlobalRole): string {
  return `/${role.toLowerCase()}/projects`;
}

export function publicUser(user: User) {
  const { password: _password, ...rest } = user;
  void _password;
  return rest;
}
