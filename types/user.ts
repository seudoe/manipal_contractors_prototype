/**
 * spec: project_coding_spec.md section 4 (User / Organization Model) + section 26 (Core TypeScript Interfaces)
 *
 * NOTE: the spec's `users` DB table (section 4) and its `User` TS interface (section 26)
 * don't fully agree — the interface drops created_at/updated_at. Both are kept here
 * since the table lists them; drop createdAt/updatedAt later if the interface wins out.
 *
 * NOTE: `password` is prototype-only (plaintext, for the demo login flow in
 * app/actions.ts) and is NOT part of the real spec schema — there's no real
 * auth provider yet. Remove it once real auth (e.g. Supabase Auth) is wired up.
 */

export type GlobalRole = "STAKEHOLDER" | "CONTRACTOR" | "INSPECTOR";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  globalRole: GlobalRole;
  password: string;
  createdAt: string;
  updatedAt: string;
}
