import { createClient } from "@/lib/supabase/server";
import { weekdayLabel } from "@/lib/data/public";

const WEEKDAY_INDEX: Record<string, number> = {
  domingo: 0,
  segunda: 1,
  terca: 2,
  quarta: 3,
  quinta: 4,
  sexta: 5,
  sabado: 6,
};

export type NextOccurrence = {
  id: string;
  name: string;
  date: Date;
  weekday: string;
  start_time: string;
};

/** Calcula a próxima data/hora em que cada culto recorrente vai acontecer. */
function nextOccurrenceFor(weekday: string, startTime: string, from: Date): Date {
  const targetDow = WEEKDAY_INDEX[weekday] ?? 0;
  const [h, m] = startTime.split(":").map(Number);

  const result = new Date(from);
  result.setHours(h, m, 0, 0);

  let diff = (targetDow - from.getDay() + 7) % 7;
  if (diff === 0 && result <= from) diff = 7;
  result.setDate(from.getDate() + diff);
  return result;
}

export async function getDashboardData() {
  const supabase = await createClient();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
  const todayIso = now.toISOString().slice(0, 10);

  const [membersRes, servicesRes, eventsCountRes, upcomingEventsRes, monthTxRes, chartTxRes] = await Promise.all([
    supabase.from("members").select("id", { count: "exact", head: true }).eq("status", "ativo"),
    supabase.from("services").select("id, name, weekday, start_time").eq("status", "ativo"),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .gte("event_date", todayIso)
      .eq("status", "agendado"),
    supabase
      .from("events")
      .select("id, name, event_date, start_time, location")
      .gte("event_date", todayIso)
      .eq("status", "agendado")
      .order("event_date", { ascending: true })
      .limit(5),
    supabase
      .from("financial_transactions")
      .select("type, amount")
      .gte("transaction_date", startOfMonth)
      .lte("transaction_date", endOfMonth),
    supabase
      .from("financial_transactions")
      .select("type, amount, transaction_date")
      .gte("transaction_date", monthsAgoIso(5)),
  ]);

  const membersCount = membersRes.count ?? 0;
  const eventsCount = eventsCountRes.count ?? 0;

  const services = servicesRes.data ?? [];
  const occurrences: NextOccurrence[] = services.map((s) => ({
    id: s.id,
    name: s.name,
    weekday: s.weekday,
    start_time: s.start_time,
    date: nextOccurrenceFor(s.weekday, s.start_time, now),
  }));
  occurrences.sort((a, b) => a.date.getTime() - b.date.getTime());
  const nextService = occurrences[0] ?? null;

  const monthTx = monthTxRes.data ?? [];
  const income = monthTx.filter((t) => t.type === "entrada").reduce((sum, t) => sum + Number(t.amount), 0);
  const expenses = monthTx.filter((t) => t.type === "despesa").reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expenses;

  const chartTx = chartTxRes.data ?? [];
  const chartData = buildMonthlyChart(chartTx);

  const upcomingEvents = (upcomingEventsRes.data ?? []).map((e) => ({
    id: e.id,
    label: e.name,
    date: e.event_date as string,
    time: e.start_time as string | null,
    place: e.location as string | null,
    kind: "evento" as const,
  }));

  const upcomingServices = occurrences.slice(0, 3).map((o) => ({
    id: o.id,
    label: `${o.name} — ${weekdayLabel(o.weekday)}`,
    date: o.date.toISOString().slice(0, 10),
    time: o.start_time,
    place: null,
    kind: "culto" as const,
  }));

  const appointments = [...upcomingServices, ...upcomingEvents]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  return {
    membersCount,
    nextService,
    eventsCount,
    balance,
    income,
    expenses,
    chartData,
    appointments,
  };
}

function monthsAgoIso(months: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - months, 1);
  return d.toISOString().slice(0, 10);
}

function buildMonthlyChart(rows: { type: string; amount: number; transaction_date: string }[]) {
  const buckets = new Map<string, { entradas: number; despesas: number }>();
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.set(key, { entradas: 0, despesas: 0 });
  }

  for (const row of rows) {
    const key = row.transaction_date.slice(0, 7);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    if (row.type === "entrada") bucket.entradas += Number(row.amount);
    else bucket.despesas += Number(row.amount);
  }

  const MONTH_LABELS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

  return Array.from(buckets.entries()).map(([key, value]) => {
    const [, month] = key.split("-");
    return {
      mes: MONTH_LABELS[Number(month) - 1],
      entradas: value.entradas,
      despesas: value.despesas,
    };
  });
}
