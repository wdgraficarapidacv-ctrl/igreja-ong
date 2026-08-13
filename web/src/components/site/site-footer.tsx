import { DoveMark } from "@/components/dove-mark";
import type { ChurchSettings } from "@/lib/data/public";
import { whatsappLink } from "@/lib/whatsapp";

export function SiteFooter({ settings }: { settings: ChurchSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="px-6 pb-8 pt-12">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 font-serif text-base">
            <DoveMark className="h-[26px] w-[26px]" />
            MARN
          </div>
          <p className="mt-2 max-w-[44ch] text-[12.5px] text-ink-soft">
            {settings.church_name} — {settings.address}.
          </p>
        </div>
        <div className="flex gap-3">
          {settings.instagram_url && (
            <a
              href={settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line px-4 py-2 text-[13.5px] text-ink-soft hover:border-accent hover:text-accent-ink"
            >
              Instagram
            </a>
          )}
          {settings.whatsapp && (
            <a
              href={whatsappLink(settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line px-4 py-2 text-[13.5px] text-ink-soft hover:border-accent hover:text-accent-ink"
            >
              WhatsApp
            </a>
          )}
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-[1400px] text-center text-xs text-ink-soft">
        © {year} MARN Church. Todos os direitos reservados.
        {!settings.email && <span className="text-warning"> — e-mail de contato pendente de confirmação.</span>}
      </p>
    </footer>
  );
}
