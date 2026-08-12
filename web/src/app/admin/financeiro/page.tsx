import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteTransaction } from "@/lib/actions/financial";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants/financial";
import { PageHeader, EmptyState } from "@/components/admin/ui/page-header";
import { ConfirmDeleteButton } from "@/components/admin/ui/confirm-delete-button";
import { StatCard } from "@/components/admin/stat-card";
import { DashboardChart } from "@/components/admin/dashboard-chart";

export const metadata = { title: "Financeiro" };

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

type SearchParams = { mes?: string; ano?: string; tipo?: string; categoria?: string };

export default async function FinancialPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const supabase = await createClient();

  const now = new Date();
  const year = Number(params.ano ?? now.getFullYear());
  const month = params.mes ? Number(params.mes) : now.getMonth() + 1;

  const startOfMonth = `${year}-${String(month).padStart(2, "0")}-01`;
  const endOfMonth = new Date(year, month, 0).toISOString().slice(0, 10);

  let query = supabase
    .from("financial_transactions")
    .select("*")
    .gte("transaction_date", startOfMonth)
    .lte("transaction_date", endOfMonth)
    .order("transaction_date", { ascending: false });

  if (params.tipo) query = query.eq("type", params.tipo);
  if (params.categoria) query = query.eq("category", params.categoria);

  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().slice(0, 10);

  const [{ data: transactions }, { data: chartRows }] = await Promise.all([
    query,
    supabase.from("financial_transactions").select("type, amount, transaction_date").gte("transaction_date", sixMonthsAgo),
  ]);

  const income = (transactions ?? []).filter((t) => t.type === "entrada").reduce((s, t) => s + Number(t.amount), 0);
  const expenses = (transactions ?? []).filter((t) => t.type === "despesa").reduce((s, t) => s + Number(t.amount), 0);
  const balance = income - expenses;

  const chartData = buildChart(chartRows ?? []);
  const allCategories = Array.from(new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]));
  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

  return (
    <div>
      <PageHeader title="Financeiro" subtitle="Entradas, despesas e saldo da igreja" actionHref="/admin/financeiro/novo" actionLabel="+ Nova movimentação" />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Entradas no período" value={currency.format(income)} icon={<ArrowUp />} tone="positive" />
        <StatCard label="Despesas no período" value={currency.format(expenses)} icon={<ArrowDown />} tone="negative" />
        <StatCard label="Saldo" value={currency.format(balance)} icon={<Coin />} tone={balance >= 0 ? "positive" : "negative"} />
      </div>

      <div className="mb-8 rounded-2xl border border-line bg-bg-raised p-5 sm:p-6">
        <h2 className="mb-4 font-serif text-[17px] font-normal">Entradas x despesas — últimos 6 meses</h2>
        <DashboardChart data={chartData} />
      </div>

      <form className="mb-6 flex flex-wrap gap-3" method="get">
        <select name="mes" defaultValue={String(month)} className="rounded-[10px] border border-line bg-bg-raised px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent">
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <select name="ano" defaultValue={String(year)} className="rounded-[10px] border border-line bg-bg-raised px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent">
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select name="tipo" defaultValue={params.tipo ?? ""} className="rounded-[10px] border border-line bg-bg-raised px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent">
          <option value="">Todos os tipos</option>
          <option value="entrada">Entradas</option>
          <option value="despesa">Despesas</option>
        </select>
        <select name="categoria" defaultValue={params.categoria ?? ""} className="rounded-[10px] border border-line bg-bg-raised px-3.5 py-2.5 text-[14.5px] outline-none focus:border-accent">
          <option value="">Todas as categorias</option>
          {allCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-[10px] border border-line px-4 py-2.5 text-[14.5px] font-semibold text-ink-soft hover:border-accent hover:text-accent-ink">
          Filtrar
        </button>
      </form>

      {!transactions || transactions.length === 0 ? (
        <EmptyState>Nenhuma movimentação nesse período.</EmptyState>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-line md:block">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <thead className="bg-bg-raised text-[12px] uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-semibold">Data</th>
                  <th className="px-4 py-3 font-semibold">Tipo</th>
                  <th className="px-4 py-3 font-semibold">Categoria</th>
                  <th className="px-4 py-3 font-semibold">Descrição</th>
                  <th className="px-4 py-3 font-semibold">Valor</th>
                  <th className="px-4 py-3 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-t border-line">
                    <td className="px-4 py-3 text-ink-soft">{new Date(`${t.transaction_date}T00:00:00`).toLocaleDateString("pt-BR")}</td>
                    <td className="px-4 py-3">
                      <span className={t.type === "entrada" ? "text-success" : "text-danger"}>
                        {t.type === "entrada" ? "Entrada" : "Despesa"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{t.category}</td>
                    <td className="px-4 py-3 text-ink-soft">{t.description ?? "—"}</td>
                    <td className="px-4 py-3 font-medium">{currency.format(Number(t.amount))}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link href={`/admin/financeiro/${t.id}/editar`} className="text-[13px] font-semibold text-accent-ink hover:underline">
                          Editar
                        </Link>
                        <ConfirmDeleteButton action={deleteTransaction.bind(null, t.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:hidden">
            {transactions.map((t) => (
              <div key={t.id} className="rounded-xl border border-line bg-bg-raised p-4">
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <span className={`text-[13px] font-semibold ${t.type === "entrada" ? "text-success" : "text-danger"}`}>
                    {t.type === "entrada" ? "Entrada" : "Despesa"} · {t.category}
                  </span>
                  <span className="font-medium">{currency.format(Number(t.amount))}</span>
                </div>
                <p className="text-[13px] text-ink-soft">{t.description ?? "Sem descrição"}</p>
                <p className="text-[12.5px] text-ink-soft">{new Date(`${t.transaction_date}T00:00:00`).toLocaleDateString("pt-BR")}</p>
                <div className="mt-3 flex gap-4 border-t border-line pt-3">
                  <Link href={`/admin/financeiro/${t.id}/editar`} className="text-[13px] font-semibold text-accent-ink hover:underline">
                    Editar
                  </Link>
                  <ConfirmDeleteButton action={deleteTransaction.bind(null, t.id)} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function buildChart(rows: { type: string; amount: number; transaction_date: string }[]) {
  const now = new Date();
  const buckets = new Map<string, { entradas: number; despesas: number }>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.set(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, { entradas: 0, despesas: 0 });
  }
  for (const row of rows) {
    const bucket = buckets.get(row.transaction_date.slice(0, 7));
    if (!bucket) continue;
    if (row.type === "entrada") bucket.entradas += Number(row.amount);
    else bucket.despesas += Number(row.amount);
  }
  const labels = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return Array.from(buckets.entries()).map(([key, v]) => ({
    mes: labels[Number(key.split("-")[1]) - 1],
    ...v,
  }));
}

function ArrowUp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowDown() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Coin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v8M9.5 9.5c0-1 1-1.5 2.5-1.5s2.5.6 2.5 1.6-1 1.3-2.5 1.7-2.5.8-2.5 1.8S10.7 15 12 15s2.5-.5 2.5-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
