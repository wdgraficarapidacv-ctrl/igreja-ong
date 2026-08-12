import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteCellGroup } from "@/lib/actions/cell-groups";
import { PageHeader, EmptyState } from "@/components/admin/ui/page-header";
import { StatusBadge } from "@/components/admin/ui/form-fields";
import { ConfirmDeleteButton } from "@/components/admin/ui/confirm-delete-button";
import { weekdayLabel } from "@/lib/data/public";

export const metadata = { title: "Células" };

type SearchParams = { cidade?: string; bairro?: string; status?: string };

type CellGroupRow = {
  id: string;
  name: string;
  leader_name: string;
  city: string | null;
  neighborhood: string | null;
  weekday: string | null;
  meeting_time: string | null;
  address: string | null;
  people_count: number;
  status: string;
};

export default async function CellGroupsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: allCellGroups } = await supabase
    .from("cell_groups")
    .select("id, name, leader_name, city, neighborhood, weekday, meeting_time, address, people_count, status")
    .order("city", { ascending: true })
    .order("neighborhood", { ascending: true });

  const cellGroups = (allCellGroups ?? []) as CellGroupRow[];

  const cities = Array.from(new Set(cellGroups.map((c) => c.city).filter((c): c is string => Boolean(c)))).sort();

  let filtered = cellGroups;
  if (params.cidade) filtered = filtered.filter((c) => c.city === params.cidade);
  if (params.bairro) filtered = filtered.filter((c) => (c.neighborhood ?? "").toLowerCase().includes(params.bairro!.toLowerCase()));
  if (params.status) filtered = filtered.filter((c) => c.status === params.status);

  const totalPeople = filtered.reduce((sum, c) => sum + (c.people_count ?? 0), 0);

  // Agrupa por cidade pra ficar fácil enxergar a cobertura por região
  const byCity = new Map<string, CellGroupRow[]>();
  for (const c of filtered) {
    const key = c.city ?? "Cidade não definida";
    if (!byCity.has(key)) byCity.set(key, []);
    byCity.get(key)!.push(c);
  }

  return (
    <div>
      <PageHeader
        title="Células"
        subtitle={`Refrigério no lar — ${filtered.length} célula(s) · ${totalPeople} pessoas ao todo`}
        actionHref="/admin/celulas/novo"
        actionLabel="+ Cadastrar célula"
      />

      <form className="mb-8 flex flex-wrap gap-3" method="get">
        <select
          name="cidade"
          defaultValue={params.cidade ?? ""}
          className="rounded-[10px] border border-line bg-bg-raised px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent"
        >
          <option value="">Todas as cidades</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="bairro"
          defaultValue={params.bairro}
          placeholder="Buscar por bairro…"
          className="min-w-[200px] flex-1 rounded-[10px] border border-line bg-bg-raised px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent"
        />
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="rounded-[10px] border border-line bg-bg-raised px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent"
        >
          <option value="">Todos os status</option>
          <option value="ativo">Ativa</option>
          <option value="inativo">Inativa</option>
        </select>
        <button type="submit" className="rounded-[10px] border border-line px-4 py-2.5 text-[14.5px] font-semibold text-ink-soft hover:border-accent hover:text-accent-ink">
          Filtrar
        </button>
      </form>

      {filtered.length === 0 ? (
        <EmptyState>Nenhuma célula encontrada com esses filtros.</EmptyState>
      ) : (
        <div className="grid gap-10">
          {Array.from(byCity.entries()).map(([city, group]) => (
            <div key={city}>
              <h2 className="mb-4 flex items-center gap-2 font-serif text-[19px] font-normal">
                {city}
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[12px] font-sans font-semibold text-accent-ink">
                  {group.length}
                </span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-line bg-bg-raised p-5">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="font-serif text-[17px] font-normal">{c.name}</h3>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="mb-1 text-[13.5px] text-accent-ink">Líder: {c.leader_name}</p>
                    <p className="mb-1 text-[13px] text-ink-soft">
                      {c.weekday ? weekdayLabel(c.weekday) : "Dia a definir"}
                      {c.meeting_time ? ` · ${c.meeting_time.slice(0, 5)}` : ""}
                    </p>
                    {c.neighborhood && <p className="mb-1 text-[13px] text-ink-soft">Bairro: {c.neighborhood}</p>}
                    {c.address && <p className="mb-3 text-[12.5px] text-ink-soft">{c.address}</p>}

                    <p className="mb-4 font-serif text-[24px] font-normal">
                      {c.people_count} <span className="text-[13px] font-sans text-ink-soft">pessoas</span>
                    </p>

                    <div className="flex items-center gap-4 border-t border-line pt-3">
                      <Link href={`/admin/celulas/${c.id}/editar`} className="text-[13px] font-semibold text-accent-ink hover:underline">
                        Editar / atualizar
                      </Link>
                      <ConfirmDeleteButton action={deleteCellGroup.bind(null, c.id)} confirmMessage={`Excluir a célula "${c.name}"?`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
