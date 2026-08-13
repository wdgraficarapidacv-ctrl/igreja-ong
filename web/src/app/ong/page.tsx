import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site/site-header";
import { AnnouncementBanner } from "@/components/site/announcement-banner";
import { SiteFooter } from "@/components/site/site-footer";
import { PhotoCarousel, type CarouselPhoto } from "@/components/site/photo-carousel";
import { OficinasSection } from "@/components/site/oficinas-section";
import { whatsappLink } from "@/lib/whatsapp";
import { getChurchSettings, getPublishedAnnouncement } from "@/lib/data/public";

// Fotos de cada frente de trabalho. Pra trocar um placeholder por foto de
// verdade: salve o arquivo em web/public/ong/<pasta>/ e preencha `src` com
// o caminho, ex: "/ong/india/foto1.jpg".
const STORIES: { title: string; text: string; photos: CarouselPhoto[] }[] = [
  {
    title: "Projeto na Índia",
    text: "Também caminhamos ao lado de crianças na Índia — um projeto que já entregou dezenas de kits e levou cuidado prático pra dentro de casa, através de parceiros locais como o Pastor George.",
    photos: [
      { src: "/ong/india/foto1.jpg", alt: "Entrega de kits para crianças na Índia" },
      { src: "/ong/india/foto2.jpg", alt: "Voluntário apresentando os kits doados às crianças" },
    ],
  },
  {
    title: "Famílias que ajudamos",
    text: "Toda semana, famílias em situação de vulnerabilidade recebem cestas básicas e uma visita de perto — não é só doação, é cuidado.",
    photos: [
      { src: "/ong/familias/foto1.jpg", alt: "Família recebendo doação em casa" },
      { src: "/ong/familias/foto2.jpg", alt: "Alimentos separados para doação" },
      { src: "/ong/familias/foto3.jpg", alt: "Carro carregado com doações de alimentos" },
      { src: "/ong/familias/foto4.jpg", alt: "Almoço em família na sede da igreja" },
      { src: "/ong/familias/foto5.jpg", alt: "Mesa longa reunindo famílias para uma refeição" },
      { src: "/ong/familias/foto6.jpg", alt: "Famílias reunidas à mesa, celebrando juntas" },
      { src: "/ong/familias/foto7.jpg", alt: "Momento de comunhão entre as famílias atendidas" },
      { src: "/ong/familias/foto8.jpg", alt: "Distribuição de kits para crianças e famílias" },
      { src: "/ong/familias/foto9.webp", alt: "Jantar em família reunindo gerações na igreja" },
    ],
  },
  {
    title: "Discipulado",
    text: "Discipulado é caminhar junto: pequenos grupos se reúnem pra comer, orar e crescer na fé, semana após semana.",
    photos: [
      { src: "/ong/discipulado/foto1.jpg", alt: "Grupo reunido à mesa para uma refeição em oração" },
      { src: "/ong/discipulado/foto2.jpg", alt: "Encontro de discipulado em grupo" },
    ],
  },
  {
    title: "Parcerias",
    text: "Empresas e professores parceiros doam tempo, conhecimento e recursos para multiplicar esse impacto — cada apoio conta.",
    photos: [
      { src: "/ong/parcerias/foto1.jpg", alt: "Reunião com parceiro em escritório" },
      { src: "/ong/parcerias/foto2.jpg", alt: "Aperto de mãos selando uma parceria" },
      { src: "/ong/parcerias/foto3.jpg", alt: "Equipe de voluntários e parceiros" },
    ],
  },
];

export const metadata = {
  title: "ONG Eu Vejo Você",
  description:
    "Inclusão social e capacitação profissional gratuita para crianças, jovens, adultos e idosos em situação de vulnerabilidade.",
};

const OBJECTIVES = [
  "Oferecer cursos gratuitos de datilografia e informática básica para capacitar os beneficiários em habilidades essenciais para o mercado de trabalho.",
  "Promover cursos profissionalizantes como programação, linguagens de programação, design gráfico (Photoshop e Corel Draw), costura e dança artística.",
  "Incentivar atividades esportivas como capoeira, kung fu e futebol para desenvolvimento físico e mental.",
  "Promover o desenvolvimento criativo por meio de atividades de desenho cartunizado.",
  "Oferecer assistência social a famílias em situação de vulnerabilidade.",
  "Proporcionar laboterapia (terapia ocupacional) para crianças, jovens, adultos e idosos, incentivando a integração social e o bem-estar emocional.",
];

const AUDIENCE = [
  "Crianças, jovens, adultos e idosos em situação de vulnerabilidade social.",
  "Pessoas com deficiência e necessidades especiais, que necessitem de suporte para o desenvolvimento profissional e pessoal.",
  "Comunidades carentes de acesso a educação, cultura, esporte e assistência social.",
];

const AREAS = [
  {
    title: "Capacitação Profissional",
    items: [
      "Datilografia e Informática Básica — alfabetização digital para iniciantes.",
      "Cursos profissionalizantes: programação (Python, Java, HTML), Photoshop, Corel Draw, costura, entre outros.",
      "Design e arte: desenho cartunizado, arte digital.",
      "Dança artística: expressão corporal e criatividade.",
    ],
  },
  {
    title: "Esportes e Atividades Físicas",
    items: ["Capoeira, Kung Fu e Futebol — aulas regulares para disciplina, trabalho em equipe e saúde física."],
  },
  {
    title: "Laboterapia",
    items: ["Atividades ocupacionais adaptadas para diferentes faixas etárias, com foco em integração social e reabilitação emocional."],
  },
  {
    title: "Assistência Social",
    items: [
      "Acompanhamento psicossocial com psicólogos e assistentes sociais.",
      "Distribuição de recursos: cestas básicas, roupas e orientação em serviços públicos.",
    ],
  },
];

const STRUCTURE = [
  {
    title: "Sede principal",
    items: [
      "Salas de aula equipadas com computadores.",
      "Áreas para atividades artísticas e laboratórios de tecnologia.",
      "Salas de atendimento para orientação psicossocial.",
      "Quadras e espaços abertos para esportes.",
    ],
  },
  {
    title: "Recursos humanos",
    items: [
      "Professores e instrutores especializados em informática, design, artes, dança e esportes.",
      "Assistentes sociais e psicólogos para suporte emocional e social.",
      "Voluntários para organização e apoio aos participantes.",
    ],
  },
];

const PARTNERSHIPS = [
  {
    title: "Parcerias",
    items: [
      "Empresas de tecnologia e design gráfico que forneçam materiais, softwares e consultorias.",
      "Prefeituras e governos estaduais, para financiamento de projetos e concessão de espaços públicos.",
      "Outras ONGs e organizações do terceiro setor, para potencializar o impacto social.",
    ],
  },
  {
    title: "Captação de recursos",
    items: [
      "Doações de indivíduos e empresas privadas.",
      "Financiamento por meio de editais públicos e privados.",
      "Eventos beneficentes e campanhas de arrecadação de fundos.",
      "Crowdfunding e plataformas digitais de financiamento coletivo.",
    ],
  },
];

const INDICATORS = [
  "Número de alunos formados, monitorado a cada ano.",
  "Percentual de alunos que conseguem emprego após a formação.",
  "Participação em atividades sociais e esportivas, e evolução nas habilidades físicas e sociais.",
  "Satisfação dos participantes, medida em pesquisas periódicas.",
];

export default async function OngPage() {
  const [settings, announcement] = await Promise.all([getChurchSettings(), getPublishedAnnouncement()]);
  const waHref = whatsappLink(settings.whatsapp, "Oi! Quero saber mais sobre a ONG Eu Vejo Você.");

  return (
    <div id="top" className="flex min-h-screen flex-col">
      <SiteHeader whatsapp={settings.whatsapp} />
      <AnnouncementBanner announcement={announcement} />

      <main className="flex-1">
        {/* Hero */}
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
              Ação social da MARN Church
            </p>
            <h1 className="mb-5 max-w-[18ch] text-balance font-serif text-[38px] font-normal leading-[1.1] tracking-tight sm:text-[52px]">
              ONG <em className="text-accent-ink not-italic">Eu Vejo Você</em>
            </h1>
            <p className="max-w-[60ch] text-lg text-ink-soft">
              Inclusão social e capacitação profissional gratuita para crianças, jovens, adultos e idosos em
              situação de vulnerabilidade — abrindo caminho para o mercado de trabalho e fortalecendo comunidades.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[10px] bg-accent px-[26px] py-3.5 text-[15px] font-bold text-accent-contrast shadow-[0_8px_24px_rgba(79,199,232,0.32)]"
              >
                Quero apoiar ou participar
              </a>
              <a
                href="#atuacao"
                className="rounded-[10px] border border-line px-[26px] py-3.5 text-[15px] font-bold text-ink transition-colors hover:border-accent hover:text-accent-ink"
              >
                Ver áreas de atuação
              </a>
            </div>
          </div>
        </section>

        {/* Missão e Visão */}
        <section className="border-b border-line px-6 py-[88px]">
          <div className="mx-auto max-w-[1400px]">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Quem somos</p>
            <h2 className="mb-11 max-w-[26ch] text-balance font-serif text-[28px] font-normal tracking-tight sm:text-[38px]">
              Uma rede de transformação social.
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              <IdentityCard
                label="Missão"
                text="Proporcionar oportunidades de aprendizado e desenvolvimento por meio de cursos gratuitos e atividades socioeducativas para crianças, jovens, adultos e idosos, capacitando-os para o mercado de trabalho e contribuindo para o fortalecimento das suas comunidades."
              />
              <IdentityCard
                label="Visão"
                text="Ser referência na inclusão social e capacitação profissional de pessoas em situação de vulnerabilidade social, contribuindo para o seu desenvolvimento pessoal e profissional por meio da oferta de cursos gratuitos e atividades de suporte."
              />
            </div>
          </div>
        </section>

        {/* Objetivos + Público-alvo */}
        <section className="border-b border-line px-6 py-[88px]">
          <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Objetivos</p>
              <h2 className="mb-6 font-serif text-[24px] font-normal tracking-tight">O que a Eu Vejo Você faz acontecer</h2>
              <ul className="grid gap-3">
                {OBJECTIVES.map((o) => (
                  <BulletItem key={o}>{o}</BulletItem>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Público-alvo</p>
              <h2 className="mb-6 font-serif text-[24px] font-normal tracking-tight">Para quem é</h2>
              <div className="grid gap-3">
                {AUDIENCE.map((a) => (
                  <div key={a} className="rounded-xl border border-line bg-bg-raised px-4 py-3.5 text-[14px] text-ink-soft">
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Áreas de atuação */}
        <section className="border-b border-line px-6 py-[88px]" id="atuacao">
          <div className="mx-auto max-w-[1400px]">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Áreas de atuação e serviços</p>
            <h2 className="mb-11 font-serif text-[28px] font-normal tracking-tight sm:text-[38px]">Cursos e atividades gratuitas</h2>

            <div className="grid gap-5 sm:grid-cols-2">
              {AREAS.map((area) => (
                <div key={area.title} className="rounded-2xl border border-line bg-bg-raised p-6">
                  <h3 className="mb-4 font-serif text-[18px] font-normal text-accent-ink">{area.title}</h3>
                  <ul className="grid gap-2.5">
                    {area.items.map((item) => (
                      <BulletItem key={item} small>
                        {item}
                      </BulletItem>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Metodologia */}
        <section className="border-b border-line px-6 py-[88px]">
          <div className="mx-auto max-w-[1400px]">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Metodologia de trabalho</p>
            <div className="rounded-2xl border border-accent bg-bg-raised p-8 shadow-[0_0_0_1px_var(--accent)_inset] sm:p-10">
              <p className="max-w-[70ch] text-[16px] leading-relaxed text-ink-soft">
                A metodologia é centrada no desenvolvimento integral dos indivíduos, considerando suas necessidades
                físicas, emocionais e sociais. A abordagem é inclusiva, acolhendo pessoas de todas as idades e
                contextos — as atividades são adaptadas para o público-alvo, respeitando as diferenças de
                aprendizagem e as limitações físicas ou cognitivas.
              </p>
            </div>
          </div>
        </section>

        {/* Estrutura */}
        <section className="border-b border-line px-6 py-[88px]">
          <div className="mx-auto max-w-[1400px]">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Estrutura da ONG</p>
            <h2 className="mb-11 font-serif text-[28px] font-normal tracking-tight sm:text-[38px]">Como funciona por dentro</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {STRUCTURE.map((s) => (
                <div key={s.title} className="rounded-2xl border border-line bg-bg-raised p-6">
                  <h3 className="mb-4 font-serif text-[18px] font-normal">{s.title}</h3>
                  <ul className="grid gap-2.5">
                    {s.items.map((item) => (
                      <BulletItem key={item} small>
                        {item}
                      </BulletItem>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Parcerias e captação */}
        <section className="border-b border-line px-6 py-[88px]">
          <div className="mx-auto max-w-[1400px]">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Parcerias e captação de recursos</p>
            <h2 className="mb-11 font-serif text-[28px] font-normal tracking-tight sm:text-[38px]">Como a rede se sustenta</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {PARTNERSHIPS.map((s) => (
                <div key={s.title} className="rounded-2xl border border-line bg-bg-raised p-6">
                  <h3 className="mb-4 font-serif text-[18px] font-normal">{s.title}</h3>
                  <ul className="grid gap-2.5">
                    {s.items.map((item) => (
                      <BulletItem key={item} small>
                        {item}
                      </BulletItem>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impacto e indicadores */}
        <section className="border-b border-line px-6 py-[88px]">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-11 grid gap-5 rounded-2xl border border-line bg-bg-raised p-8 sm:p-10 md:grid-cols-[auto_1fr] md:items-center">
              <p className="font-serif text-[56px] leading-none text-accent-ink">500+</p>
              <div>
                <p className="mb-1 text-[12.5px] font-bold uppercase tracking-[0.12em] text-accent-ink">Impacto esperado</p>
                <p className="max-w-[60ch] text-[15px] leading-relaxed text-ink-soft">
                  A expectativa é impactar positivamente as comunidades atendidas, capacitando e apoiando mais de{" "}
                  <strong className="text-ink">500 pessoas por ano</strong> — aumentando oportunidades de emprego e
                  desenvolvimento pessoal e criando uma rede de transformação social.
                </p>
              </div>
            </div>

            <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Indicadores de sucesso</p>
            <h2 className="mb-6 font-serif text-[24px] font-normal tracking-tight">Como medimos o resultado</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {INDICATORS.map((i) => (
                <BulletItem key={i}>{i}</BulletItem>
              ))}
            </div>
          </div>
        </section>

        {/* Registros em fotos */}
        <PhotoStories />

        {/* CTA final */}
        <section
          className="border-b border-line px-6 py-[90px] text-center"
          style={{ background: "radial-gradient(ellipse 700px 400px at 50% 0%, var(--accent-soft), transparent 65%)" }}
        >
          <p className="mb-2.5 flex justify-center text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">
            Faça parte dessa rede
          </p>
          <h2 className="mx-auto mb-4 max-w-[24ch] text-balance font-serif text-[28px] font-normal tracking-tight sm:text-[38px]">
            Apoie, indique ou participe da Eu Vejo Você.
          </h2>
          <p className="mx-auto mb-8 max-w-[48ch] text-base text-ink-soft">
            Fale com a gente pelo WhatsApp — conte se você quer se matricular em um curso, ser voluntário ou apoiar
            como parceiro.
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-[10px] bg-accent px-[26px] py-3.5 text-[15px] font-bold text-accent-contrast shadow-[0_8px_24px_rgba(79,199,232,0.32)]"
          >
            Falar no WhatsApp
          </a>
        </section>
      </main>

      <SiteFooter settings={settings} />
    </div>
  );
}

function PhotoStories() {
  return (
    <section className="border-b border-line px-6 py-[88px]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-16">
        <div>
          <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Registros</p>
          <h2 className="max-w-[26ch] text-balance font-serif text-[28px] font-normal tracking-tight sm:text-[38px]">
            Cada foto é uma vida tocada.
          </h2>
        </div>

        <OficinasSection />

        {STORIES.map((story) => (
          <div key={story.title}>
            <h3 className="mb-2.5 font-serif text-[19px] font-normal">{story.title}</h3>
            <p className="mb-6 max-w-[70ch] text-[15px] leading-relaxed text-ink-soft">{story.text}</p>
            <PhotoCarousel photos={story.photos} />
          </div>
        ))}
      </div>
    </section>
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

function BulletItem({ children, small }: { children: ReactNode; small?: boolean }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
      <span className={`${small ? "text-[13.5px]" : "text-[14.5px]"} leading-relaxed text-ink-soft`}>{children}</span>
    </li>
  );
}
