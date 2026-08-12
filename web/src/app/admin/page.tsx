import Link from "next/link";
import { getDashboardData } from "@/lib/data/admin";
import { weekdayLabel } from "@/lib/data/public";
import { StatCard } from "@/components/admin/stat-card";
import { DashboardChart } from "@/components/admin/dashboard-chart";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateFmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });

export default async function AdminDashboardPage() {
  const { membersCount, nextService, eventsCount, balance, income, expenses, chartData, appointments } =
    await getDashboardData();

  return (
    <div className="mx-auto max-w-[1200px]">
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Painel</p>
      <h1 className="mb-1 font-serif text-[28px] font-normal">Dashboard</h1>
      <p className="mb-8 text-sm text-ink-soft">Visão geral da igreja</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Membros ativos"
          value={membersCount}
          hint="Cadastrados no sistema"
          icon={<UsersIcon />}
        />
        <StatCard
          label="Próximo culto"
          value={nextService ? `${weekdayLabel(nextService.weekday)} · ${nextService.start_time.slice(0, 5)}` : "—"}
          hint={nextService ? nextService.name : "Nenhum culto ativo cadastrado"}
          icon={<CandleIcon />}
        />
        <StatCard label="Eventos próximos" value={eventsCount} hint="Agendados a partir de hoje" icon={<CalendarIcon />} />
        <StatCard
          label="Saldo do mês"
          value={currency.format(balance)}
          hint={`${currency.format(income)} entradas · ${currency.format(expenses)} despesas`}
          icon={<CoinIcon />}
          tone={balance >= 0 ? "positive" : "negative"}
        />
      </div>

      <div className="mb-8 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-line bg-bg-raised p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-[17px] font-normal">Resumo financeiro — últimos 6 meses</h2>
            <Link href="/admin/financeiro" className="text-[13px] text-accent-ink hover:underline">
              Ver financeiro →
            </Link>
          </div>
          <DashboardChart data={chartData} />
        </div>

        <div className="rounded-2xl border border-line bg-bg-raised p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-[17px] font-normal">Próximos compromissos</h2>
            <Link href="/admin/agenda" className="text-[13px] text-accent-ink hover:underline">
              Ver agenda →
            </Link>
          </div>

          {appointments.length === 0 ? (
            <p className="text-sm text-ink-soft">Nenhum compromisso cadastrado ainda.</p>
          ) : (
            <ul className="space-y-3">
              {appointments.map((a) => (
                <li key={`${a.kind}-${a.id}`} className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-3">
                  <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-[10px] bg-accent-soft text-center text-accent-ink">
                    <span className="text-[10px] font-bold uppercase leading-none">
                      {dateFmt.format(new Date(`${a.date}T00:00:00`)).split(" ")[1]}
                    </span>
                    <span className="text-[13px] font-bold leading-none">
                      {dateFmt.format(new Date(`${a.date}T00:00:00`)).split(" ")[0]}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium">{a.label}</p>
                    <p className="text-[12.5px] text-ink-soft">
                      {a.kind === "culto" ? "Culto" : "Evento"}
                      {a.time ? ` · ${a.time.slice(0, 5)}` : ""}
                      {a.place ? ` · ${a.place}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 20c1.2-3.4 4-5 6-5s4.8 1.6 6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.5 20c.7-2.3 2-3.7 3.5-4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function CandleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="9" width="6" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 9V5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 10h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function CoinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v8M9.5 9.5c0-1 1-1.5 2.5-1.5s2.5.6 2.5 1.6-1 1.3-2.5 1.7-2.5.8-2.5 1.8S10.7 15 12 15s2.5-.5 2.5-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
