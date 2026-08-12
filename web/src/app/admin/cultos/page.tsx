import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteService, toggleServiceStatus } from "@/lib/actions/services";
import { PageHeader, EmptyState } from "@/components/admin/ui/page-header";
import { StatusBadge } from "@/components/admin/ui/form-fields";
import { ConfirmDeleteButton } from "@/components/admin/ui/confirm-delete-button";
import { weekdayLabel } from "@/lib/data/public";

export const metadata = { title: "Cultos" };

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("weekday", { ascending: true })
    .order("start_time", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Cultos"
        subtitle="O que estiver ativo aqui aparece automaticamente no site público."
        actionHref="/admin/cultos/novo"
        actionLabel="+ Cadastrar culto"
      />

      {!services || services.length === 0 ? (
        <EmptyState>Nenhum culto cadastrado ainda.</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.id} className="rounded-2xl border border-line bg-bg-raised p-5">
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="text-[12.5px] font-bold uppercase tracking-wide text-accent-ink">{weekdayLabel(s.weekday)}</p>
                <StatusBadge status={s.status} />
              </div>
              <p className="mb-1 font-serif text-[26px] font-normal">
                {s.start_time.slice(0, 5)}
                {s.end_time ? `–${s.end_time.slice(0, 5)}` : ""}
              </p>
              <p className="mb-1 text-[15px] font-semibold">{s.name}</p>
              {s.description && <p className="mb-3 text-[13.5px] text-ink-soft">{s.description}</p>}

              <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-line pt-3">
                <Link href={`/admin/cultos/${s.id}/editar`} className="text-[13px] font-semibold text-accent-ink hover:underline">
                  Editar
                </Link>
                <form action={toggleServiceStatus.bind(null, s.id, s.status)}>
                  <button type="submit" className="text-[13px] font-semibold text-ink-soft hover:text-ink">
                    {s.status === "ativo" ? "Desativar" : "Ativar"}
                  </button>
                </form>
                <ConfirmDeleteButton action={deleteService.bind(null, s.id)} confirmMessage={`Excluir o culto "${s.name}"?`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
