"use client";

import { useActionState, useState, useTransition } from "react";
import {
  Mail,
  Lock,
  User,
  ShieldCheck,
  Landmark,
  HardHat,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";
import { login, register, quickLogin, type AuthFormState } from "@/app/actions";

const initialState: AuthFormState = {};

const ROLES: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "STAKEHOLDER", label: "Stakeholder", icon: Landmark },
  { value: "CONTRACTOR", label: "Contractor", icon: HardHat },
  { value: "INSPECTOR", label: "Inspector", icon: ClipboardCheck },
];

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginState, loginAction, loginPending] = useActionState(
    login,
    initialState
  );
  const [registerState, registerAction, registerPending] = useActionState(
    register,
    initialState
  );

  return (
    <div className="w-full max-w-sm rounded-2xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <div className="mb-6 flex rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            mode === "login"
              ? "bg-white text-black shadow-sm dark:bg-zinc-950 dark:text-white"
              : "text-zinc-500"
          }`}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            mode === "register"
              ? "bg-white text-black shadow-sm dark:bg-zinc-950 dark:text-white"
              : "text-zinc-500"
          }`}
        >
          Register
        </button>
      </div>

      {mode === "login" ? (
        <form action={loginAction} className="flex flex-col gap-4">
          <Field label="Email" name="email" type="email" placeholder="you@example.com" icon={Mail} />
          <Field label="Password" name="password" type="password" placeholder="••••••••" icon={Lock} />
          {loginState.error && <ErrorText>{loginState.error}</ErrorText>}
          <SubmitButton pending={loginPending} label="Log in" />
          <QuickLoginButtons />
          <Hint />
        </form>
      ) : (
        <form action={registerAction} className="flex flex-col gap-4">
          <Field label="Name" name="name" type="text" placeholder="Your name" icon={User} />
          <Field label="Email" name="email" type="email" placeholder="you@example.com" icon={Mail} />
          <Field label="Password" name="password" type="password" placeholder="••••••••" icon={Lock} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Role
            </label>
            <div className="relative">
              <ShieldCheck
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <select
                name="global_role"
                defaultValue="STAKEHOLDER"
                className="w-full rounded-lg border border-black/10 bg-transparent py-2 pl-9 pr-3 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/30"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {registerState.error && <ErrorText>{registerState.error}</ErrorText>}
          <SubmitButton pending={registerPending} label="Create account" />
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  icon: Icon,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required
          className="w-full rounded-lg border border-black/10 bg-transparent py-2 pl-9 pr-3 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/30"
        />
      </div>
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-red-600 dark:text-red-400">{children}</p>;
}

function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
    >
      {pending ? "Please wait…" : label}
    </button>
  );
}

function QuickLoginButtons() {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-2 border-t border-black/10 pt-4 dark:border-white/10">
      <p className="text-center text-xs text-zinc-500">
        Or jump in as a demo user
      </p>
      <div className="flex gap-2">
        {ROLES.map((r) => {
          const Icon = r.icon;
          return (
            <button
              key={r.value}
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(() => {
                  quickLogin(r.value as "STAKEHOLDER" | "CONTRACTOR" | "INSPECTOR");
                })
              }
              className="flex flex-1 flex-col items-center gap-1 rounded-lg border border-black/10 px-2 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-60 dark:border-white/15 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Icon size={16} />
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Hint() {
  return (
    <p className="text-center text-xs text-zinc-500">
      Demo accounts: ananya.rao@stakeholders.gov · vikram.shah@buildcorp.com ·
      meera.iyer@qualityinspect.gov — password &quot;password&quot;
    </p>
  );
}
