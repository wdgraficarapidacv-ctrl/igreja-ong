import type { ReactNode } from "react";
import type { ChurchSettings } from "@/lib/data/public";
import { formatBrPhone, whatsappLink } from "@/lib/whatsapp";

export function Location({ settings }: { settings: ChurchSettings }) {
  const mapQuery = settings.address ? encodeURIComponent(settings.address) : "";

  return (
    <section className="border-b border-line px-6 py-[88px]" id="local">
      <div className="mx-auto max-w-[1760px]">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Venha nos visitar</p>
        <h2 className="mb-3.5 font-serif text-[28px] font-normal tracking-tight sm:text-[38px]">Onde estamos</h2>
        <p className="mb-11 max-w-[56ch] text-base text-ink-soft">
          Estamos de portas abertas em todos os cultos — não precisa avisar antes, é só chegar.
        </p>

        <div className="grid gap-11 md:grid-cols-2" id="contato">
          <div>
            <ul className="mb-[30px] grid gap-[18px]">
              <InfoRow
                icon={
                  <path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z" stroke="currentColor" strokeWidth="1.8" />
                }
                label="Endereço"
                value={settings.address ?? "—"}
              />
              {settings.whatsapp && (
                <InfoRow
                  icon={
                    <path
                      d="M4 5c0-.6.4-1 1-1h3l2 5-2 1.5c1 2.4 3.1 4.5 5.5 5.5L15 14l5 2v3c0 .6-.4 1-1 1C10.5 20 4 13.5 4 5Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  }
                  label="WhatsApp"
                  value={
                    <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="text-accent-ink hover:underline">
                      {formatBrPhone(settings.whatsapp)}
                    </a>
                  }
                />
              )}
              <InfoRow
                icon={
                  <>
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                }
                label="E-mail"
                value={settings.email ?? <em className="not-italic text-warning">a definir</em>}
              />
            </ul>

            <div className="flex flex-wrap gap-3">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-[13.5px] text-ink-soft transition-colors hover:border-accent hover:text-accent-ink"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                  @marnchurch
                </a>
              )}
              {settings.whatsapp && (
                <a
                  href={whatsappLink(settings.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-[13.5px] text-ink-soft transition-colors hover:border-accent hover:text-accent-ink"
                >
                  Chamar no WhatsApp
                </a>
              )}
            </div>
          </div>

          <div className="min-h-[340px] overflow-hidden rounded-2xl border border-line bg-bg-raised">
            <iframe
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de localização do MARN"
              className="h-full min-h-[340px] w-full border-0"
              style={{ filter: "grayscale(0.15) contrast(1.05)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <li className="flex items-start gap-3.5">
      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[9px] bg-accent-soft text-accent-ink">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          {icon}
        </svg>
      </span>
      <div>
        <b className="mb-0.5 block text-[15px] font-semibold">{label}</b>
        <span className="text-sm text-ink-soft">{value}</span>
      </div>
    </li>
  );
}
