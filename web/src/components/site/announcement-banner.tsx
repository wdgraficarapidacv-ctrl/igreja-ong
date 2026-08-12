import type { AnnouncementItem } from "@/lib/data/public";

export function AnnouncementBanner({ announcement }: { announcement: AnnouncementItem | null }) {
  if (!announcement) return null;

  return (
    <div className="border-b border-line bg-accent-soft">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-3 gap-y-1 px-6 py-2.5 text-[13.5px]">
        <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-accent-contrast">
          Aviso
        </span>
        <strong className="text-ink">{announcement.title}</strong>
        <span className="text-ink-soft">{announcement.body}</span>
      </div>
    </div>
  );
}
