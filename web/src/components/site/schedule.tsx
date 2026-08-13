import type { ServiceItem } from "@/lib/data/public";
import { weekdayLabel } from "@/lib/data/public";

export function Schedule({ services }: { services: ServiceItem[] }) {
  return (
    <section className="border-b border-line px-6 py-[88px]" id="cultos">
      <div className="mx-auto max-w-[1400px]">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Agenda semanal</p>
        <h2 className="mb-3.5 font-serif text-[28px] font-normal tracking-tight sm:text-[38px]">
          Horários dos nossos cultos
        </h2>
        <p className="mb-11 max-w-[56ch] text-base text-ink-soft">
          Chegue um pouco antes — sempre tem alguém pronto pra te receber na porta.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {services.map((s, i) => (
            <div
              key={s.id}
              className={`rounded-2xl border px-[26px] py-7 ${
                i < 2 ? "border-accent shadow-[0_0_0_1px_var(--accent)_inset] bg-bg-raised" : "border-line bg-bg-raised"
              }`}
            >
              <p className="mb-2.5 text-[12.5px] font-bold uppercase tracking-[0.1em] text-accent-ink">
                {weekdayLabel(s.weekday)}
              </p>
              <p className="mb-2 font-serif text-[34px] font-normal">
                {s.start_time.slice(0, 5)}
                {s.end_time ? `–${s.end_time.slice(0, 5)}` : ""}
              </p>
              <p className="mb-1.5 text-[15.5px] font-semibold">{s.name}</p>
              {s.description && <p className="text-sm text-ink-soft">{s.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
