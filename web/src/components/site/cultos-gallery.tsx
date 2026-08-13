import { FloatingPhotoWall } from "@/components/site/floating-photo-wall";
import type { CarouselPhoto } from "@/components/site/photo-carousel";

const PHOTOS: CarouselPhoto[] = [
  { src: "/culto/foto1.jpg", alt: "Momento de culto na MARN Church" },
  { src: "/culto/foto2.jpg", alt: "Congregação reunida em culto" },
  { src: "/culto/foto3.jpg", alt: "Batismo nas águas durante o culto" },
  { src: "/culto/foto4.jpg", alt: "Batizados com a Bíblia, logo após o batismo" },
  { src: "/culto/foto5.jpg", alt: "Batizados ao ar livre, celebrando a nova aliança" },
  { src: "/culto/foto6.jpg", alt: "Grupo do EVVULD reunido em oração" },
  { src: "/culto/foto7.jpg", alt: "Abraço emocionado em meio a um testemunho" },
  { src: "/culto/foto8.jpg", alt: "Congregação emocionada ouvindo um testemunho de vida" },
  { src: "/culto/foto9.jpg", alt: "Momento de oração e bênção diante da cruz" },
  { src: "/culto/foto10.jpg", alt: "Irmãos unidos, fruto de um novo coração" },
];

export function CultosGallery() {
  return (
    <section className="border-b border-line px-6 py-[88px]">
      <div className="mx-auto max-w-[1400px]">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Registros</p>
        <h2 className="mb-2.5 font-serif text-[24px] font-normal tracking-tight">Cultos</h2>
        <p className="mb-8 max-w-[70ch] text-[15px] leading-relaxed text-ink-soft">
          Um pouco de como é celebrar junto — batismos, testemunhos e vidas transformadas em cada encontro com Deus e
          com a família da igreja.
        </p>
        <FloatingPhotoWall photos={PHOTOS} />
      </div>
    </section>
  );
}
