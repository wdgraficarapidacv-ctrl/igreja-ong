import { PhotoCarousel, type CarouselPhoto } from "@/components/site/photo-carousel";

const PHOTOS: CarouselPhoto[] = [
  { src: "/culto/foto1.jpg", alt: "Momento de culto na MARN Church" },
  { src: "/culto/foto2.jpg", alt: "Congregação reunida em culto" },
];

export function CultosGallery() {
  return (
    <section className="border-b border-line px-6 py-[88px]">
      <div className="mx-auto max-w-[1120px]">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Registros</p>
        <h2 className="mb-2.5 font-serif text-[24px] font-normal tracking-tight">Cultos</h2>
        <p className="mb-6 max-w-[70ch] text-[15px] leading-relaxed text-ink-soft">
          Um pouco de como é celebrar junto — cada culto é um novo encontro com Deus e com a família da igreja.
        </p>
        <PhotoCarousel photos={PHOTOS} />
      </div>
    </section>
  );
}
