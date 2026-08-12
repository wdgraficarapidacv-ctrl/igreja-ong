"use client";

import { useRef } from "react";

export type CarouselPhoto = {
  src?: string;
  alt: string;
};

/**
 * Carrossel com setas laterais — mostra várias fotos por vez (3 no desktop,
 * ~1.2 no celular) e desliza uma "página" a cada clique na seta. Fotos sem
 * `src` ainda aparecem como um espaço reservado, pra dar pra montar a seção
 * antes mesmo de ter a foto final.
 */
export function PhotoCarousel({ photos }: { photos: CarouselPhoto[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByPage(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.92, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((p, i) => (
          <div
            key={i}
            className="aspect-[4/3] w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-bg-raised sm:w-[47%] lg:w-[31.5%]"
          >
            {p.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.src} alt={p.alt} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-soft">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
                  <circle cx="8.5" cy="9.5" r="1.4" stroke="currentColor" strokeWidth="1.4" />
                  <path d="m4 17 5-5 4 4 3-3 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[12px]">Foto em breve</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Fotos anteriores"
            onClick={() => scrollByPage(-1)}
            className="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg/85 text-ink backdrop-blur transition-colors hover:border-accent hover:text-accent-ink sm:flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Próximas fotos"
            onClick={() => scrollByPage(1)}
            className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg/85 text-ink backdrop-blur transition-colors hover:border-accent hover:text-accent-ink sm:flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
