import { SiteHeader } from "@/components/site/site-header";
import { AnnouncementBanner } from "@/components/site/announcement-banner";
import { CtaFinal } from "@/components/site/cta-final";
import { SiteFooter } from "@/components/site/site-footer";
import { DoveMark } from "@/components/dove-mark";
import {
  getActiveServices,
  getChurchSettings,
  getPublishedAnnouncement,
} from "@/lib/data/public";

export const metadata = {
  title: "Sobre Nós",
  description: "Missão, visão, propósito e liderança da MARN Church.",
};

const VALUES = [
  {
    name: "Amor",
    text: "Demonstramos o amor de Cristo em tudo o que fazemos, acolhendo todos com braços abertos e corações compassivos.",
  },
  {
    name: "Unidade",
    text: "Caminhamos em unidade e forte propósito, pois sem unidade não há foco, e sem foco não conseguimos cumprir o desígnio divino.",
  },
  {
    name: "Ativação da Identidade",
    text: "Ativamos a verdadeira identidade de cada pessoa em Deus, ajudando a descobrir quem somos desde antes da fundação do mundo.",
  },
  {
    name: "Excelência",
    text: "Buscamos a excelência em tudo, fundamentados na Palavra de Deus e na liberdade do Espírito Santo.",
  },
];

export default async function SobrePage() {
  const [settings, services, announcement] = await Promise.all([
    getChurchSettings(),
    getActiveServices(),
    getPublishedAnnouncement(),
  ]);

  return (
    <div id="top" className="flex min-h-screen flex-col">
      <SiteHeader whatsapp={settings.whatsapp} />
      <AnnouncementBanner announcement={announcement} />

      <main className="flex-1">
        {/* Hero da página */}
        <section
          className="relative overflow-hidden border-b border-line px-6 pb-20 pt-24"
          style={{
            background:
              "radial-gradient(ellipse 900px 500px at 15% -10%, var(--accent-soft), transparent 60%), radial-gradient(ellipse 700px 500px at 100% 0%, #101d38, transparent 55%)",
          }}
        >
          <div className="mx-auto max-w-[1120px]">
            <p className="mb-[18px] flex items-center gap-2.5 text-[12.5px] font-bold uppercase tracking-[0.16em] text-accent-ink">
              <span className="inline-block h-px w-[26px] bg-accent" />
              Sobre nós
            </p>
            <h1 className="mb-5 max-w-[18ch] text-balance font-serif text-[38px] font-normal leading-[1.1] tracking-tight sm:text-[52px]">
              Um refrigério <em className="text-accent-ink not-italic">para as nações</em>.
            </h1>
            <p className="max-w-[60ch] text-lg text-ink-soft">
              A identidade da MARN Church em quatro palavras: propósito, unidade, identidade e excelência —
              fundamentados na Palavra e na liberdade do Espírito Santo.
            </p>
          </div>
        </section>

        {/* Missão / Visão / Propósito */}
        <section className="border-b border-line px-6 py-[88px]">
          <div className="mx-auto max-w-[1120px]">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Identidade da igreja</p>
            <h2 className="mb-11 max-w-[24ch] text-balance font-serif text-[28px] font-normal tracking-tight sm:text-[38px]">
              O que nos move todos os dias.
            </h2>

            <div className="grid gap-5 md:grid-cols-3">
              <IdentityCard
                label="Missão"
                text="Ser um refrigério para as nações, transformando vidas através do evangelho de Jesus Cristo, ativando a verdadeira identidade de cada pessoa em Deus e capacitando para o cumprimento do propósito divino."
              />
              <IdentityCard
                label="Visão"
                text="Ser uma igreja de impacto global que acolhe, edifica e capacita cada pessoa, guiando o Corpo de Cristo em unidade para cumprir o desígnio divino através de ações transformadoras e amor incondicional."
              />
              <IdentityCard
                label="Propósito"
                text="Voltar os corações das pessoas a Deus, fundamentados na Palavra e na liberdade do Espírito Santo, testemunhando milagres, restauração de famílias e crescimento em maturidade espiritual."
              />
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="border-b border-line px-6 py-[88px]">
          <div className="mx-auto max-w-[1120px]">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">O que sustenta a caminhada</p>
            <h2 className="mb-11 font-serif text-[28px] font-normal tracking-tight sm:text-[38px]">Nossos valores</h2>

            <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v) => (
                <div key={v.name} className="rounded-[14px] border border-line bg-bg-raised px-5 py-6">
                  <h3 className="mb-2 font-serif text-[17px] font-normal text-accent-ink">{v.name}</h3>
                  <p className="text-[13.5px] text-ink-soft">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Liderança */}
        <section className="border-b border-line px-6 py-[88px]">
          <div className="mx-auto max-w-[1120px]">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Nossa liderança</p>
            <h2 className="mb-11 font-serif text-[28px] font-normal tracking-tight sm:text-[38px]">Quem guia a MARN Church</h2>

            <div className="grid gap-10 rounded-2xl border border-line bg-bg-raised p-8 sm:p-10 md:grid-cols-[220px_1fr] md:items-start">
              <div className="mx-auto flex h-[200px] w-[200px] items-center justify-center rounded-full border border-line bg-bg md:mx-0">
                <DoveMark className="h-20 w-20" />
              </div>
              <div>
                <h3 className="mb-1 font-serif text-2xl font-normal">Apóstolo Waldir Rodrigues</h3>
                <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-ink">
                  Presidente e Fundador
                </p>
                <p className="text-[15.5px] leading-relaxed text-ink-soft">
                  Ministro apostólico estabelecido por Deus para ser um refrigério para as nações, focado em
                  capacitar e ativar a verdadeira identidade de cada pessoa em Cristo, guiando o Corpo de Cristo em
                  unidade, foco e propósito segundo o coração de Deus.
                </p>
                <a
                  href="https://www.instagram.com/apostolowaldir/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block text-[13.5px] font-semibold text-accent-ink hover:underline"
                >
                  @apostolowaldir →
                </a>
              </div>
            </div>
            <p className="mt-4 text-[12px] text-warning">Foto oficial pendente — placeholder acima até o envio.</p>
          </div>
        </section>

        <CtaFinal settings={settings} services={services} />
      </main>

      <SiteFooter settings={settings} />
    </div>
  );
}

function IdentityCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-2xl border border-accent bg-bg-raised p-7 shadow-[0_0_0_1px_var(--accent)_inset]">
      <p className="mb-3 text-[12.5px] font-bold uppercase tracking-[0.12em] text-accent-ink">{label}</p>
      <p className="text-[15px] leading-relaxed text-ink-soft">{text}</p>
    </div>
  );
}
