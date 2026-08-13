import type { ReactNode } from "react";
import type { MinistryItem } from "@/lib/data/public";

const ICONS: Record<number, ReactNode> = {
  0: (
    <path d="M9 18V6l8 6-8 6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  ),
  1: (
    <>
      <path d="M9 18V5l10-2v13M9 9l10-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="16" r="3" stroke="currentColor" strokeWidth="1.8" />
    </>
  ),
  2: (
    <>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  3: (
    <>
      <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
};

export function Ministries({ ministries }: { ministries: MinistryItem[] }) {
  return (
    <section className="border-b border-line px-6 py-[88px]" id="ministerios">
      <div className="mx-auto max-w-[1760px]">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Vida em comunidade</p>
        <h2 className="mb-3.5 font-serif text-[28px] font-normal tracking-tight sm:text-[38px]">
          Ministérios da nossa casa
        </h2>
        <p className="mb-11 max-w-[56ch] text-base text-ink-soft">
          Espaços para servir de acordo com o seu dom — do palco aos bastidores.
        </p>
        <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {ministries.map((m, i) => (
            <div
              key={m.id}
              className="rounded-[14px] border border-line bg-bg-raised px-5 py-6 transition-all hover:-translate-y-0.5 hover:border-accent"
            >
              <div className="mb-4 flex h-[42px] w-[42px] items-center justify-center rounded-[10px] bg-accent-soft text-accent-ink">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  {ICONS[i % 4]}
                </svg>
              </div>
              <h3 className="mb-2 font-serif text-[17px] font-normal">{m.name}</h3>
              {m.description && <p className="text-[13.5px] text-ink-soft">{m.description}</p>}
              {m.leader_name && (
                <p className="mt-2 text-[12px] uppercase tracking-wide text-accent-ink">Líder: {m.leader_name}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
