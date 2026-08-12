"use client";

import Link from "next/link";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="max-w-[480px] rounded-2xl border border-line bg-bg-raised p-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-warning">Não foi possível concluir</p>
        <h1 className="mb-3 font-serif text-xl font-normal">{error.message || "Algo deu errado."}</h1>
        <p className="mb-6 text-sm text-ink-soft">
          Se a mensagem falar em Supabase, é porque essa ação precisa do banco configurado — veja{" "}
          <code>web/SETUP.md</code>.
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-[10px] border border-line px-4 py-2.5 text-[14px] font-semibold text-ink-soft hover:border-accent hover:text-accent-ink"
          >
            Tentar de novo
          </button>
          <Link
            href="/admin"
            className="rounded-[10px] bg-accent px-4 py-2.5 text-[14px] font-bold text-accent-contrast hover:opacity-90"
          >
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
