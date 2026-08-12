import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteBranch } from "@/lib/actions/branches";
import { PageHeader, EmptyState } from "@/components/admin/ui/page-header";
import { StatusBadge } from "@/components/admin/ui/form-fields";
import { ConfirmDeleteButton } from "@/components/admin/ui/confirm-delete-button";

export const metadata = { title: "Filiais" };

export default async function BranchesPage() {
  const supabase = await createClient();
  const { data: branches } = await supabase
    .from("branches")
    .select("*")
    .order("is_headquarters", { ascending: false })
    .order("city", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Filiais"
        subtitle="O que estiver ativo aqui aparece automaticamente em /filiais."
        actionHref="/admin/filiais/novo"
        actionLabel="+ Cadastrar filial"
      />

      {!branches || branches.length === 0 ? (
        <EmptyState>Nenhuma filial cadastrada ainda.</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((b) => (
            <div key={b.id} className="rounded-2xl border border-line bg-bg-raised p-5">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="font-serif text-[18px] font-normal">
                  {b.city}
                  {b.state ? ` — ${b.state}` : ""}
                </h3>
                <StatusBadge status={b.status} />
              </div>
              {b.is_headquarters && (
                <span className="mb-2 inline-block rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent-ink">
                  Sede principal
                </span>
              )}
              <p className="mb-1 text-[13.5px] text-ink-soft">{b.address ?? "Endereço a confirmar"}</p>
              <p className="mb-4 text-[13.5px] text-ink-soft">{b.whatsapp ?? "Contato a confirmar"}</p>

              <div className="flex items-center gap-4 border-t border-line pt-3">
                <Link href={`/admin/filiais/${b.id}/editar`} className="text-[13px] font-semibold text-accent-ink hover:underline">
                  Editar
                </Link>
                <ConfirmDeleteButton action={deleteBranch.bind(null, b.id)} confirmMessage={`Excluir a filial de ${b.city}?`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
