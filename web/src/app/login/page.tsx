import Link from "next/link";
import { DoveMark } from "@/components/dove-mark";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { localAdminExists } from "@/lib/local-auth/store";
import { AuthCard } from "./auth-card";

export const metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const initialError = params.error === "sem_permissao" ? "Esse usuário não tem permissão de administrador." : undefined;

  const supabaseConfigured = isSupabaseConfigured();
  const canRegister = !supabaseConfigured && !(await localAdminExists());

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 py-16"
      style={{
        background:
          "radial-gradient(ellipse 900px 500px at 50% -10%, var(--accent-soft), transparent 60%), var(--bg)",
      }}
    >
      <Link href="/" className="mb-8 flex items-center gap-2.5 font-serif text-lg font-bold">
        <DoveMark className="h-9 w-9" />
        MARN
      </Link>

      <AuthCard
        next={params.next ?? "/admin"}
        initialError={initialError}
        supabaseConfigured={supabaseConfigured}
        canRegister={canRegister}
      />

      <Link href="/" className="mt-7 text-[13px] text-ink-soft hover:text-accent-ink">
        ← Voltar para o site
      </Link>
    </div>
  );
}
