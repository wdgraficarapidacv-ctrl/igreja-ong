import Link from "next/link";
import { DoveMark } from "@/components/dove-mark";
import { createClient } from "@/lib/supabase/server";
import { UpdatePasswordForm } from "./update-password-form";

export const metadata = { title: "Redefinir senha" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  let exchangeError = false;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    exchangeError = Boolean(error);
  }

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

      <div className="w-full max-w-[420px] rounded-2xl border border-line bg-bg-raised px-8 py-9 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <h1 className="mb-1.5 font-serif text-2xl font-normal">Nova senha</h1>

        {!code || exchangeError ? (
          <>
            <p className="mb-2 text-sm text-ink-soft">
              Esse link de redefinição é inválido ou já expirou.
            </p>
            <Link href="/login" className="text-[13.5px] text-accent-ink hover:underline">
              ← Pedir um novo link
            </Link>
          </>
        ) : (
          <>
            <p className="mb-7 text-sm text-ink-soft">Escolha uma nova senha para o seu acesso.</p>
            <UpdatePasswordForm />
          </>
        )}
      </div>
    </div>
  );
}
