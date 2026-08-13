import type { CarouselPhoto } from "@/components/site/photo-carousel";

// Pequenas variações de inclinação e "boiada", repetidas em loop pra cada
// cartão parecer levemente diferente do vizinho sem precisar de JS.
const TILTS = [-3, 2, -1.5, 3, -2.5, 1.5, -1, 2.5];

/**
 * Mural de fotos flutuante — em vez do carrossel com setas, as fotos ficam
 * soltas num grid tipo mosaico, cada uma baloiçando bem devagar e com uma
 * leve inclinação, pra dar uma sensação viva/orgânica em vez de "álbum".
 */
export function FloatingPhotoWall({ photos }: { photos: CarouselPhoto[] }) {
  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [column-fill:balance]">
      {photos.map((p, i) => {
        const tilt = TILTS[i % TILTS.length];
        const floatClass = i % 2 === 0 ? "photo-float" : "photo-float-alt";
        const delay = `${(i % 5) * 0.6}s`;
        // alterna alturas pra dar cara de mosaico em vez de grid parelho
        const aspect = i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-[4/5]" : "aspect-square";

        return (
          <div
            key={i}
            className="mb-4 break-inside-avoid"
            style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
          >
            <div
              className={`${floatClass} ${aspect} group overflow-hidden rounded-2xl border border-line bg-bg-raised shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:!translate-y-0 hover:!rotate-0 hover:scale-[1.03] hover:border-accent`}
              style={{ animationDelay: delay }}
            >
              {p.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.src} alt={p.alt} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-soft">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
                    <circle cx="8.5" cy="9.5" r="1.4" stroke="currentColor" strokeWidth="1.4" />
                    <path d="m4 17 5-5 4 4 3-3 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[11px]">Foto em breve</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
