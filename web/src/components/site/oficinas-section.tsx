import { PhotoCarousel, type CarouselPhoto } from "@/components/site/photo-carousel";

type Workshop = {
  name: string;
  photos: CarouselPhoto[];
};

// Cada oficina é um carrossel próprio. Pra trocar um placeholder por foto
// de verdade: salve o arquivo em web/public/ong/oficinas/<pasta>/ e
// preencha `src`, ex: "/ong/oficinas/programacao/foto1.jpg".
const WORKSHOPS: Workshop[] = [
  {
    name: "Confeitaria",
    photos: [
      { src: "/ong/oficinas/confeitaria/foto1.jpg", alt: "Voluntárias preparando brownies artesanais na oficina de confeitaria" },
      { src: "/ong/oficinas/confeitaria/foto2.jpg", alt: "Produção de brownies para venda na oficina de confeitaria" },
      { src: "/ong/oficinas/confeitaria/foto3.jpg", alt: "Brownies Metanoia embalados e etiquetados por sabor" },
      { src: "/ong/oficinas/confeitaria/foto4.jpg", alt: "Brownie sabor nutella pronto para venda" },
    ],
  },
  {
    name: "Programação",
    photos: [
      { alt: "Aula de programação" },
      { alt: "Alunos praticando programação" },
    ],
  },
  {
    name: "IA e Tecnologia",
    photos: [
      { alt: "Oficina de inteligência artificial" },
      { alt: "Alunos explorando ferramentas de tecnologia" },
    ],
  },
  {
    name: "Computação Básica e Avançada",
    photos: [
      { alt: "Aula de informática básica" },
      { alt: "Turma na oficina de computação avançada" },
    ],
  },
  {
    name: "Kung Fu",
    photos: [
      { alt: "Aula de kung fu" },
      { alt: "Alunos treinando kung fu" },
    ],
  },
  {
    name: "Mecânica Automotiva",
    photos: [
      { alt: "Oficina de mecânica automotiva" },
      { alt: "Alunos praticando mecânica automotiva" },
    ],
  },
];

export function OficinasSection() {
  return (
    <div>
      <h3 className="mb-2.5 font-serif text-[19px] font-normal">Oficinas</h3>
      <p className="mb-8 max-w-[70ch] text-[15px] leading-relaxed text-ink-soft">
        Datilografia, informática, programação, IA, Photoshop, Corel Draw, costura, confeitaria, dança artística,
        capoeira, kung fu, mecânica automotiva, futebol, desenho cartunizado — cursos gratuitos que abrem porta pro
        mercado de trabalho e revelam talentos.
      </p>

      <div className="grid gap-10">
        {WORKSHOPS.map((workshop) => (
          <div key={workshop.name}>
            <h4 className="mb-3 text-[14px] font-bold uppercase tracking-[0.08em] text-accent-ink">{workshop.name}</h4>
            <PhotoCarousel photos={workshop.photos} />
          </div>
        ))}
      </div>
    </div>
  );
}
