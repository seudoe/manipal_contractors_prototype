import type { User } from "@/types/user";

/**
 * This is now the single source of truth for users — login, register, and
 * quickLogin (app/actions.ts) all read/write this array via db/queries.ts.
 * There used to be a separate lib/auth.ts with its own 3 login-only demo
 * accounts; that's gone, so this file both seeds the domain dataset (3
 * stakeholders, 4 contractor-org users, 2 inspectors) and doubles as the
 * login table. `password` is prototype-only, plaintext, and not part of the
 * real spec schema (see the NOTE in types/user.ts) — there's no real auth
 * provider yet.
 *
 * This is a module-level array acting as our in-memory "table" — it's
 * mutated directly by db/queries.ts's createUser() when someone registers.
 *
 * All 9 demo accounts share the password "password" for convenience.
 */
export const users: User[] = [
  // stakeholders
  {
    id: "user-st-1",
    email: "ananya.rao@stakeholders.gov",
    name: "Ananya Rao",
    globalRole: "STAKEHOLDER",
    password: "password",
    createdAt: "2025-01-10T00:00:00.000Z",
    updatedAt: "2025-01-10T00:00:00.000Z",
  },
  {
    id: "user-st-2",
    email: "rajesh.menon@stakeholders.gov",
    name: "Rajesh Menon",
    globalRole: "STAKEHOLDER",
    password: "password",
    createdAt: "2025-01-10T00:00:00.000Z",
    updatedAt: "2025-01-10T00:00:00.000Z",
  },
  {
    id: "user-st-3",
    email: "priya.nair@stakeholders.gov",
    name: "Priya Nair",
    globalRole: "STAKEHOLDER",
    password: "password",
    createdAt: "2025-01-10T00:00:00.000Z",
    updatedAt: "2025-01-10T00:00:00.000Z",
  },

  // contractor-org owners
  {
    id: "user-ct-1",
    email: "vikram.shah@buildcorp.com",
    name: "Vikram Shah",
    globalRole: "CONTRACTOR",
    password: "password",
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "user-ct-2",
    email: "suresh.kumar@electroworks.com",
    name: "Suresh Kumar",
    globalRole: "CONTRACTOR",
    password: "password",
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "user-ct-3",
    email: "neha.kapoor@skyrise.com",
    name: "Neha Kapoor",
    globalRole: "CONTRACTOR",
    password: "password",
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "user-ct-4",
    email: "arjun.verma@aquabuild.com",
    name: "Arjun Verma",
    globalRole: "CONTRACTOR",
    password: "password",
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
  },

  // inspectors
  {
    id: "user-in-1",
    email: "meera.iyer@qualityinspect.gov",
    name: "Meera Iyer",
    globalRole: "INSPECTOR",
    password: "password",
    createdAt: "2025-01-20T00:00:00.000Z",
    updatedAt: "2025-01-20T00:00:00.000Z",
  },
  {
    id: "user-in-2",
    email: "karan.bhatt@qualityinspect.gov",
    name: "Karan Bhatt",
    globalRole: "INSPECTOR",
    password: "password",
    createdAt: "2025-01-20T00:00:00.000Z",
    updatedAt: "2025-01-20T00:00:00.000Z",
  },
];
