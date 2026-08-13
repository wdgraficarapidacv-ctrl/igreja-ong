import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import { AnnouncementBanner } from "@/components/site/announcement-banner";
import { CtaFinal } from "@/components/site/cta-final";
import { SiteFooter } from "@/components/site/site-footer";
import { PhotoCarousel, type CarouselPhoto } from "@/components/site/photo-carousel";
import { getActiveServices, getChurchSettings, getPublishedAnnouncement } from "@/lib/data/public";

// Mesmas fotos usadas em /ong, reunidas aqui como um apanhado geral.
const PROJECT_PHOTOS: CarouselPhoto[] = [
  { src: "/ong/oficinas/confeitaria/foto1.jpg", alt: "Voluntárias preparando brownies artesanais na oficina de confeitaria" },
  { src: "/ong/oficinas/confeitaria/foto3.jpg", alt: "Brownies Metanoia embalados e etiquetados por sabor" },
  { src: "/ong/india/foto1.jpg", alt: "Entrega de kits para crianças na Índia" },
  { src: "/ong/india/foto2.jpg", alt: "Voluntário apresentando os kits doados às crianças" },
  { src: "/ong/familias/foto1.jpg", alt: "Família recebendo doação em casa" },
  { src: "/ong/familias/foto2.jpg", alt: "Alimentos separados para doação" },
  { src: "/ong/familias/foto3.jpg", alt: "Carro carregado com doações de alimentos" },
  { src: "/ong/discipulado/foto1.jpg", alt: "Grupo reunido à mesa para uma refeição em oração" },
  { src: "/ong/discipulado/foto2.jpg", alt: "Encontro de discipulado em grupo" },
  { src: "/ong/parcerias/foto1.jpg", alt: "Reunião com parceiro em escritório" },
  { src: "/ong/parcerias/foto2.jpg", alt: "Aperto de mãos selando uma parceria" },
  { src: "/ong/parcerias/foto3.jpg", alt: "Equipe de voluntários e parceiros" },
];

export const metadata = {
  title: "Projetos Sociais",
  description: "Conheça os projetos sociais da MARN Church — inclusão, capacitação e cuidado prático com quem precisa.",
};

// Cada frente social vira um card aqui. Pra adicionar um novo projeto no
// futuro, é só acrescentar um item nesta lista (e criar a página dele,
// como foi feito em src/app/ong/page.tsx).
const PROJECTS = [
  {
    slug: "/ong",
    name: "ONG Eu Vejo Você",
    tag: "Inclusão social e capacitação",
    image: "/ong/familias/foto1.jpg",
    description:
      "Cursos profissionalizantes e atividades socioeducativas gratuitas para crianças, jovens, adultos e idosos em situação de vulnerabilidade — capacitando pra o mercado de trabalho e fortalecendo famílias inteiras.",
    cta: "Conhecer a ONG",
  },
];

export default async function ProjetosSociaisPage() {
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
        <section
          className="relative overflow-hidden border-b border-line px-6 pb-20 pt-24"
          style={{
            background:
              "radial-gradient(ellipse 900px 500px at 15% -10%, var(--accent-soft), transparent 60%), radial-gradient(ellipse 700px 500px at 100% 0%, #101d38, transparent 55%)",
          }}
        >
          <div className="mx-auto max-w-[1760px]">
            <p className="mb-[18px] flex items-center gap-2.5 text-[12.5px] font-bold uppercase tracking-[0.16em] text-accent-ink">
              <span className="inline-block h-px w-[26px] bg-accent" />
              Impacto social
            </p>
            <h1 className="mb-5 max-w-[20ch] text-balance font-serif text-[38px] font-normal leading-[1.1] tracking-tight sm:text-[52px]">
              Fé que <em className="text-accent-ink not-italic">vira ação</em>.
            </h1>
            <p className="max-w-[60ch] text-lg text-ink-soft">
              Além dos cultos e das células, a MARN Church sustenta frentes de trabalho social — dentro e fora do
              Brasil — pra levar cuidado prático a quem mais precisa.
            </p>
          </div>
        </section>

        <section className="px-6 py-[88px]">
          <div className="mx-auto max-w-[1760px]">
            <div className="grid gap-6 sm:grid-cols-2">
              {PROJECTS.map((project) => (
                <Link
                  key={project.slug}
                  href={project.slug}
                  className="group overflow-hidden rounded-2xl border border-line bg-bg-raised transition-colors hover:border-accent"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-bg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt={project.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-6">
                    <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.1em] text-accent-ink">{project.tag}</p>
                    <h2 className="mb-2.5 font-serif text-[20px] font-normal">{project.name}</h2>
                    <p className="mb-5 text-[14px] leading-relaxed text-ink-soft">{project.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-accent-ink">
                      {project.cta} →
                    </span>
                  </div>
                </Link>
              ))}

              <div className="flex flex-col justify-center rounded-2xl border border-dashed border-line px-6 py-10 text-center">
                <p className="text-[14px] text-ink-soft">Mais frentes de trabalho social chegando em breve.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-line px-6 py-[88px]">
          <div className="mx-auto max-w-[1760px]">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Registros</p>
            <h2 className="mb-2.5 font-serif text-[24px] font-normal tracking-tight">Projetos Sociais</h2>
            <p className="mb-6 max-w-[70ch] text-[15px] leading-relaxed text-ink-soft">
              Um retrato de tudo o que já foi feito através dessas frentes — cada foto é uma vida tocada de perto.
            </p>
            <PhotoCarousel photos={PROJECT_PHOTOS} />
          </div>
        </section>

        <CtaFinal settings={settings} services={services} />
      </main>

      <SiteFooter settings={settings} />
    </div>
  );
}
