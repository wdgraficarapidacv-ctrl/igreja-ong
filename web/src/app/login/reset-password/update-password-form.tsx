"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (updateError) {
      setError("Não foi possível atualizar a senha. Peça um novo link e tente de novo.");
      return;
    }

    router.push("/admin");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">Nova senha</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
          className="w-full rounded-[10px] border border-line bg-bg px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-accent"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">Confirmar nova senha</span>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          required
          className="w-full rounded-[10px] border border-line bg-bg px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-accent"
        />
      </label>

      {error && (
        <p className="rounded-lg border border-danger/40 bg-danger-soft px-3.5 py-2.5 text-[13.5px] text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-[10px] bg-accent px-5 py-3 text-[15px] font-bold text-accent-contrast transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Salvando…" : "Salvar nova senha"}
      </button>
    </form>
  );
}
