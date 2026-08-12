import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteEvent } from "@/lib/actions/events";
import { PageHeader, EmptyState } from "@/components/admin/ui/page-header";
import { StatusBadge } from "@/components/admin/ui/form-fields";
import { ConfirmDeleteButton } from "@/components/admin/ui/confirm-delete-button";
import { MonthCalendar } from "@/components/admin/events/month-calendar";

export const metadata = { title: "Agenda" };

type SearchParams = { mes?: string; ano?: string };

export default async function AgendaPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const supabase = await createClient();

  const now = new Date();
  const year = Number(params.ano ?? now.getFullYear());
  const month = Number(params.mes ?? now.getMonth() + 1);
  const todayIso = now.toISOString().slice(0, 10);

  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const monthEnd = new Date(year, month, 0).toISOString().slice(0, 10);

  const [{ data: monthEvents }, { data: upcoming }] = await Promise.all([
    supabase.from("events").select("event_date").gte("event_date", monthStart).lte("event_date", monthEnd).neq("status", "cancelado"),
    supabase
      .from("events")
      .select("id, name, event_date, start_time, location, status, responsible")
      .gte("event_date", todayIso)
      .order("event_date", { ascending: true })
      .limit(30),
  ]);

  const eventDays = new Set((monthEvents ?? []).map((e) => e.event_date));

  return (
    <div>
      <PageHeader title="Agenda" subtitle="Calendário e próximos eventos da igreja" actionHref="/admin/agenda/novo" actionLabel="+ Cadastrar evento" />

      <div className="mb-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <MonthCalendar year={year} month={month} eventDays={eventDays} todayIso={todayIso} />

        <div>
          <h2 className="mb-4 font-serif text-[17px] font-normal">Próximos eventos</h2>
          {!upcoming || upcoming.length === 0 ? (
            <EmptyState>Nenhum evento futuro cadastrado.</EmptyState>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-bg-raised px-4 py-3.5">
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <p className="font-medium">{e.name}</p>
                      <StatusBadge status={e.status} />
                    </div>
                    <p className="text-[13px] text-ink-soft">
                      {new Date(`${e.event_date}T00:00:00`).toLocaleDateString("pt-BR")}
                      {e.start_time ? ` · ${e.start_time.slice(0, 5)}` : ""}
                      {e.location ? ` · ${e.location}` : ""}
                      {e.responsible ? ` · Resp: ${e.responsible}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/admin/agenda/${e.id}/editar`} className="text-[13px] font-semibold text-accent-ink hover:underline">
                      Editar
                    </Link>
                    <ConfirmDeleteButton action={deleteEvent.bind(null, e.id)} confirmMessage={`Excluir o evento "${e.name}"?`} />
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
