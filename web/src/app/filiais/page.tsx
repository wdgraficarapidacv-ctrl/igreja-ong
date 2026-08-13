import { SiteHeader } from "@/components/site/site-header";
import { AnnouncementBanner } from "@/components/site/announcement-banner";
import { CtaFinal } from "@/components/site/cta-final";
import { SiteFooter } from "@/components/site/site-footer";
import { whatsappLink, formatBrPhone } from "@/lib/whatsapp";
import {
  getActiveBranches,
  getActiveServices,
  getChurchSettings,
  getPublishedAnnouncement,
} from "@/lib/data/public";

export const metadata = {
  title: "Filiais",
  description: "Encontre a unidade MARN Church mais perto de você.",
};

export default async function FiliaisPage() {
  const [settings, services, announcement, branches] = await Promise.all([
    getChurchSettings(),
    getActiveServices(),
    getPublishedAnnouncement(),
    getActiveBranches(),
  ]);

  return (
    <div id="top" className="flex min-h-screen flex-col">
      <SiteHeader whatsapp={settings.whatsapp} />
      <AnnouncementBanner announcement={announcement} />

      <main className="flex-1">
        <section
          className="relative overflow-hidden border-b border-line px-6 pb-20 pt-24"
          style={{
            background:
              "radial-gradient(ellipse 900px 500px at 15% -10%, var(--accent-soft), transparent 60%), radial-gradient(ellipse 700px 500px at 100% 0%, #101d38, transparent 55%)",
          }}
        >
          <div className="mx-auto max-w-[1400px]">
            <p className="mb-[18px] flex items-center gap-2.5 text-[12.5px] font-bold uppercase tracking-[0.16em] text-accent-ink">
              <span className="inline-block h-px w-[26px] bg-accent" />
              Nossas unidades
            </p>
            <h1 className="mb-5 max-w-[20ch] text-balance font-serif text-[38px] font-normal leading-[1.1] tracking-tight sm:text-[52px]">
              Uma igreja, <em className="text-accent-ink not-italic">várias casas</em>.
            </h1>
            <p className="max-w-[60ch] text-lg text-ink-soft">
              Encontre a unidade MARN Church mais perto de você — no Brasil ou fora dele.
            </p>
          </div>
        </section>

        <section className="px-6 py-[88px]">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {branches.map((b) => (
                <div
                  key={b.id}
                  className={`rounded-2xl border bg-bg-raised p-6 ${
                    b.is_headquarters ? "border-accent shadow-[0_0_0_1px_var(--accent)_inset]" : "border-line"
                  }`}
                >
                  {b.is_headquarters && (
                    <span className="mb-3 inline-block rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-contrast">
                      Sede principal
                    </span>
                  )}
                  <h3 className="mb-1 font-serif text-[19px] font-normal">{b.name}</h3>
                  <p className="mb-4 text-[14px] text-accent-ink">
                    {b.city}
                    {b.state ? ` — ${b.state}` : ""}
                    {b.country !== "Brasil" ? ` · ${b.country}` : ""}
                  </p>

                  {b.address ? (
                    <p className="mb-4 text-[13.5px] text-ink-soft">{b.address}</p>
                  ) : (
                    <p className="mb-4 text-[13.5px] text-warning">Endereço a confirmar</p>
                  )}

                  {b.whatsapp ? (
                    <a
                      href={whatsappLink(b.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-accent-ink hover:underline"
                    >
                      {formatBrPhone(b.whatsapp)} →
                    </a>
                  ) : (
                    <span className="text-[13.5px] text-ink-soft">Contato a confirmar</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <CtaFinal settings={settings} services={services} />
      </main>

      <SiteFooter settings={settings} />
    </div>
  );
}
