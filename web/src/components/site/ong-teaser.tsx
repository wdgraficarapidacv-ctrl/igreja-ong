import Link from "next/link";

export function OngTeaser() {
  return (
    <section className="border-b border-line px-6 py-[88px]">
      <div className="mx-auto grid max-w-[1760px] gap-8 rounded-2xl border border-line bg-bg-raised p-8 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Nossa ação social</p>
          <h2 className="mb-3.5 max-w-[26ch] text-balance font-serif text-[26px] font-normal tracking-tight sm:text-[32px]">
            ONG Eu Vejo Você
          </h2>
          <p className="max-w-[60ch] text-[15px] leading-relaxed text-ink-soft">
            Cursos profissionalizantes e atividades socioeducativas gratuitas para crianças, jovens, adultos e
            idosos em situação de vulnerabilidade — o braço social da nossa igreja.
          </p>
        </div>
        <Link
          href="/ong"
          className="whitespace-nowrap rounded-[10px] bg-accent px-[26px] py-3.5 text-center text-[15px] font-bold text-accent-contrast shadow-[0_8px_24px_rgba(79,199,232,0.32)] transition-transform hover:-translate-y-px"
        >
          Conhecer a ONG →
        </Link>
      </div>
    </section>
  );
}
