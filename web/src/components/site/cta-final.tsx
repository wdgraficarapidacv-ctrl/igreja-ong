import type { ChurchSettings, ServiceItem } from "@/lib/data/public";
import { weekdayLabel } from "@/lib/data/public";
import { whatsappLink } from "@/lib/whatsapp";

export function CtaFinal({ settings, services }: { settings: ChurchSettings; services: ServiceItem[] }) {
  const highlight = services
    .slice(0, 2)
    .map((s) => `${weekdayLabel(s.weekday).toLowerCase()} às ${s.start_time.slice(0, 5)}`)
    .join(" ou ");

  return (
    <section
      className="border-b border-line px-6 py-[90px] text-center"
      style={{ background: "radial-gradient(ellipse 700px 400px at 50% 0%, var(--accent-soft), transparent 65%)" }}
    >
      <p className="mb-2.5 flex justify-center text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">
        Sua primeira vez aqui?
      </p>
      <h2 className="mx-auto mb-4 max-w-[22ch] text-balance font-serif text-[28px] font-normal tracking-tight sm:text-[38px]">
        Te esperamos no próximo culto.
      </h2>
      <p className="mx-auto mb-8 max-w-[48ch] text-base text-ink-soft">
        Sem formalidade, sem cobrança — só venha como você é.{highlight ? ` ${highlight}.` : ""}
      </p>
      <div className="flex flex-wrap justify-center gap-3.5">
        <a
          href={whatsappLink(settings.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[10px] bg-accent px-[26px] py-3.5 text-[15px] font-bold text-accent-contrast shadow-[0_8px_24px_rgba(79,199,232,0.32)]"
        >
          Chamar no WhatsApp
        </a>
        {settings.instagram_url && (
          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[10px] border border-line px-[26px] py-3.5 text-[15px] font-bold text-ink transition-colors hover:border-accent hover:text-accent-ink"
          >
            Seguir no Instagram
          </a>
        )}
      </div>
    </section>
  );
}
