import { Building2 } from "lucide-react";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-4 py-16 dark:bg-black">
      <div className="text-center">
        <Building2 size={32} className="mx-auto mb-3 text-black dark:text-zinc-50" />
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Log in
        </h1>
        <p className="mt-2 max-w-sm text-sm text-zinc-500">
          Access your projects as a stakeholder, contractor, or inspector.
        </p>
      </div>
      <AuthForm />
    </div>
  );
}
