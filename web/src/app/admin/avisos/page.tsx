import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteAnnouncement } from "@/lib/actions/announcements";
import { PageHeader, EmptyState } from "@/components/admin/ui/page-header";
import { StatusBadge } from "@/components/admin/ui/form-fields";
import { ConfirmDeleteButton } from "@/components/admin/ui/confirm-delete-button";

export const metadata = { title: "Avisos" };

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("publish_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Avisos" subtitle="O que estiver publicado e dentro do período aparece no site." actionHref="/admin/avisos/novo" actionLabel="+ Criar aviso" />

      {!announcements || announcements.length === 0 ? (
        <EmptyState>Nenhum aviso criado ainda.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {announcements.map((a) => {
            const now = new Date();
            const isLive =
              a.status === "publicado" &&
              new Date(a.publish_at) <= now &&
              (!a.expire_at || new Date(a.expire_at) >= now);
            return (
              <li key={a.id} className="rounded-xl border border-line bg-bg-raised p-4">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <p className="font-medium">{a.title}</p>
                  <StatusBadge status={a.status} />
                  {isLive && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent-ink">No ar agora</span>}
                </div>
                <p className="mb-2 text-[13.5px] text-ink-soft">{a.body}</p>
                <p className="text-[12.5px] text-ink-soft">
                  Publica em {new Date(a.publish_at).toLocaleString("pt-BR")}
                  {a.expire_at ? ` · expira em ${new Date(a.expire_at).toLocaleString("pt-BR")}` : ""}
                </p>
                <div className="mt-3 flex gap-4 border-t border-line pt-3">
                  <Link href={`/admin/avisos/${a.id}/editar`} className="text-[13px] font-semibold text-accent-ink hover:underline">
                    Editar
                  </Link>
                  <ConfirmDeleteButton action={deleteAnnouncement.bind(null, a.id)} confirmMessage={`Excluir o aviso "${a.title}"?`} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
