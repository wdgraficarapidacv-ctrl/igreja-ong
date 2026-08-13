import type { ServiceItem } from "@/lib/data/public";
import { weekdayLabel } from "@/lib/data/public";
import { whatsappLink } from "@/lib/whatsapp";

function shortWeekday(weekday: string) {
  return weekdayLabel(weekday).slice(0, 3);
}

function timeRange(s: ServiceItem) {
  return s.end_time ? `${s.start_time.slice(0, 5)}–${s.end_time.slice(0, 5)}` : s.start_time.slice(0, 5);
}

export function Hero({ services, whatsapp }: { services: ServiceItem[]; whatsapp: string | null }) {
  return (
    <section
      className="relative overflow-hidden border-b border-line px-6 pb-[90px] pt-24"
      style={{
        background:
          "radial-gradient(ellipse 900px 500px at 15% -10%, var(--accent-soft), transparent 60%), radial-gradient(ellipse 700px 500px at 100% 0%, #101d38, transparent 55%)",
      }}
    >
      <div className="mx-auto max-w-[1760px]">
        <p className="mb-[18px] flex items-center gap-2.5 text-[12.5px] font-bold uppercase tracking-[0.16em] text-accent-ink">
          <span className="inline-block h-px w-[26px] bg-accent" />
          Ministério Apostólico e Refrigério para as Nações
        </p>
        <h1 className="mb-[22px] max-w-[14ch] text-balance font-serif text-[38px] font-normal leading-[1.05] tracking-tight sm:text-[52px] lg:text-[64px]">
          Uma igreja <em className="text-accent-ink not-italic">para a sua família</em>.
        </h1>
        <p className="mb-[34px] max-w-[46ch] text-lg text-ink-soft">
          Um lugar para adorar, aprender e servir juntos — com cultos abertos ao sábado e domingo, e uma noite de
          evangelismo toda terça-feira.
        </p>
        <div className="flex flex-wrap gap-3.5">
          <a
            href="#cultos"
            className="rounded-[10px] bg-accent px-[26px] py-3.5 text-[15px] font-bold text-accent-contrast shadow-[0_8px_24px_rgba(79,199,232,0.32)] transition-transform hover:-translate-y-px"
          >
            Ver horários dos cultos
          </a>
          <a
            href={whatsappLink(whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[10px] border border-line px-[26px] py-3.5 text-[15px] font-bold text-ink transition-colors hover:border-accent hover:text-accent-ink"
          >
            Falar no WhatsApp
          </a>
        </div>

        <div className="mt-[60px] flex flex-wrap gap-9 border-t border-line pt-7">
          {services.slice(0, 3).map((s) => (
            <div key={s.id}>
              <b className="block font-serif text-[26px] font-normal">
                {shortWeekday(s.weekday)} · {timeRange(s)}
              </b>
              <span className="text-[12.5px] uppercase tracking-[0.08em] text-ink-soft">{s.name}</span>
            </div>
          ))}
          <div>
            <b className="block font-serif text-[26px] font-normal">Desde 2012</b>
            <span className="text-[12.5px] uppercase tracking-[0.08em] text-ink-soft">Igreja Apostólica</span>
          </div>
        </div>
      </div>
    </section>
  );
}
