import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteMember } from "@/lib/actions/members";
import { PageHeader, EmptyState } from "@/components/admin/ui/page-header";
import { StatusBadge } from "@/components/admin/ui/form-fields";
import { ConfirmDeleteButton } from "@/components/admin/ui/confirm-delete-button";

export const metadata = { title: "Membros" };

const PAGE_SIZE = 10;

type SearchParams = {
  q?: string;
  ministerio?: string;
  status?: string;
  pagina?: string;
};

export default async function MembersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const supabase = await createClient();

  const page = Math.max(1, Number(params.pagina ?? "1") || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("members")
    .select("id, full_name, phone, status, created_at, ministries(name)", { count: "exact" })
    .order("full_name", { ascending: true })
    .range(from, to);

  if (params.q) query = query.ilike("full_name", `%${params.q}%`);
  if (params.ministerio) query = query.eq("ministry_id", params.ministerio);
  if (params.status) query = query.eq("status", params.status);

  const [{ data: members, count }, { data: ministries }] = await Promise.all([
    query,
    supabase.from("ministries").select("id, name").order("name"),
  ]);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function buildQuery(overrides: Partial<SearchParams>) {
    const next = { ...params, ...overrides };
    const usp = new URLSearchParams();
    if (next.q) usp.set("q", next.q);
    if (next.ministerio) usp.set("ministerio", next.ministerio);
    if (next.status) usp.set("status", next.status);
    if (next.pagina) usp.set("pagina", next.pagina);
    const qs = usp.toString();
    return qs ? `?${qs}` : "";
  }

  return (
    <div>
      <PageHeader title="Membros" subtitle={`${total} membro${total === 1 ? "" : "s"} cadastrado${total === 1 ? "" : "s"}`} actionHref="/admin/membros/novo" actionLabel="+ Cadastrar membro" />

      <form className="mb-6 flex flex-wrap gap-3" method="get">
        <input
          type="text"
          name="q"
          defaultValue={params.q}
          placeholder="Buscar por nome…"
          className="min-w-[200px] flex-1 rounded-[10px] border border-line bg-bg-raised px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent"
        />
        <select
          name="ministerio"
          defaultValue={params.ministerio ?? ""}
          className="rounded-[10px] border border-line bg-bg-raised px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent"
        >
          <option value="">Todos os ministérios</option>
          {(ministries ?? []).map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="rounded-[10px] border border-line bg-bg-raised px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent"
        >
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
        <button type="submit" className="rounded-[10px] border border-line px-4 py-2.5 text-[14.5px] font-semibold text-ink-soft hover:border-accent hover:text-accent-ink">
          Filtrar
        </button>
      </form>

      {!members || members.length === 0 ? (
        <EmptyState>Nenhum membro encontrado com esses filtros.</EmptyState>
      ) : (
        <>
          {/* Tabela — desktop */}
          <div className="hidden overflow-x-auto rounded-2xl border border-line md:block">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <thead className="bg-bg-raised text-[12px] uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nome</th>
                  <th className="px-4 py-3 font-semibold">Telefone</th>
                  <th className="px-4 py-3 font-semibold">Ministério</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Cadastro</th>
                  <th className="px-4 py-3 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-t border-line">
                    <td className="px-4 py-3 font-medium">{m.full_name}</td>
                    <td className="px-4 py-3 text-ink-soft">{m.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-soft">{(Array.isArray(m.ministries) ? m.ministries[0]?.name : (m.ministries as { name: string } | null)?.name) ?? "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{new Date(m.created_at).toLocaleDateString("pt-BR")}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link href={`/admin/membros/${m.id}/editar`} className="text-[13px] font-semibold text-accent-ink hover:underline">
                          Editar
                        </Link>
                        <ConfirmDeleteButton action={deleteMember.bind(null, m.id)} confirmMessage={`Excluir ${m.full_name}?`} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards — mobile */}
          <div className="grid gap-3 md:hidden">
            {members.map((m) => (
              <div key={m.id} className="rounded-xl border border-line bg-bg-raised p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className="font-medium">{m.full_name}</p>
                  <StatusBadge status={m.status} />
                </div>
                <p className="text-[13px] text-ink-soft">{m.phone ?? "Sem telefone"}</p>
                <p className="text-[13px] text-ink-soft">{(Array.isArray(m.ministries) ? m.ministries[0]?.name : (m.ministries as { name: string } | null)?.name) ?? "Sem ministério"}</p>
                <div className="mt-3 flex gap-4 border-t border-line pt-3">
                  <Link href={`/admin/membros/${m.id}/editar`} className="text-[13px] font-semibold text-accent-ink hover:underline">
                    Editar
                  </Link>
                  <ConfirmDeleteButton action={deleteMember.bind(null, m.id)} confirmMessage={`Excluir ${m.full_name}?`} />
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={buildQuery({ pagina: String(p) })}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-[13.5px] ${
                    p === page ? "bg-accent text-accent-contrast" : "border border-line text-ink-soft hover:border-accent"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
