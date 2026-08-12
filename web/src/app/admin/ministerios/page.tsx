import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteMinistry } from "@/lib/actions/ministries";
import { PageHeader, EmptyState } from "@/components/admin/ui/page-header";
import { StatusBadge } from "@/components/admin/ui/form-fields";
import { ConfirmDeleteButton } from "@/components/admin/ui/confirm-delete-button";

export const metadata = { title: "Ministérios" };

export default async function MinistriesPage() {
  const supabase = await createClient();
  const { data: ministries } = await supabase
    .from("ministries")
    .select("*, members(count)")
    .order("name");

  return (
    <div>
      <PageHeader title="Ministérios" subtitle="Times e áreas de serviço da igreja" actionHref="/admin/ministerios/novo" actionLabel="+ Cadastrar ministério" />

      {!ministries || ministries.length === 0 ? (
        <EmptyState>Nenhum ministério cadastrado ainda.</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m) => {
            const count = Array.isArray(m.members) ? (m.members[0]?.count ?? 0) : 0;
            return (
              <div key={m.id} className="rounded-2xl border border-line bg-bg-raised p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-serif text-[18px] font-normal">{m.name}</h3>
                  <StatusBadge status={m.status} />
                </div>
                {m.description && <p className="mb-3 text-[13.5px] text-ink-soft">{m.description}</p>}
                <p className="mb-1 text-[13px] text-ink-soft">{m.leader_name ? `Líder: ${m.leader_name}` : "Sem líder definido"}</p>
                <p className="mb-4 text-[13px] text-accent-ink">{count} membro{count === 1 ? "" : "s"} vinculado{count === 1 ? "" : "s"}</p>

                <div className="flex items-center gap-4 border-t border-line pt-3">
                  <Link href={`/admin/ministerios/${m.id}/editar`} className="text-[13px] font-semibold text-accent-ink hover:underline">
                    Editar
                  </Link>
                  <ConfirmDeleteButton action={deleteMinistry.bind(null, m.id)} confirmMessage={`Excluir o ministério "${m.name}"? Membros vinculados ficarão sem ministério.`} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
