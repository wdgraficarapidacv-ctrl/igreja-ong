import Link from "next/link";

const WEEKDAY_HEADERS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTH_LABELS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function MonthCalendar({
  year,
  month, // 1-12
  eventDays, // Set of "YYYY-MM-DD" strings with events
  todayIso,
}: {
  year: number;
  month: number;
  eventDays: Set<string>;
  todayIso: string;
}) {
  const firstOfMonth = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startWeekday = firstOfMonth.getDay(); // 0 = domingo

  const cells: (number | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
  const nextMonth = month === 12 ? { y: year + 1, m: 1 } : { y: year, m: month + 1 };

  return (
    <div className="rounded-2xl border border-line bg-bg-raised p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-[17px] font-normal">
          {MONTH_LABELS[month - 1]} {year}
        </h2>
        <div className="flex gap-1.5">
          <Link href={`?mes=${prevMonth.m}&ano=${prevMonth.y}`} className="rounded-lg border border-line px-2.5 py-1.5 text-[13px] text-ink-soft hover:border-accent hover:text-accent-ink">
            ←
          </Link>
          <Link href={`?mes=${nextMonth.m}&ano=${nextMonth.y}`} className="rounded-lg border border-line px-2.5 py-1.5 text-[13px] text-ink-soft hover:border-accent hover:text-accent-ink">
            →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-ink-soft">
        {WEEKDAY_HEADERS.map((d, i) => (
          <div key={i} className="py-1.5">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const hasEvent = eventDays.has(iso);
          const isToday = iso === todayIso;
          return (
            <div
              key={i}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg text-[13px] ${
                isToday ? "border border-accent text-accent-ink" : "text-ink"
              }`}
            >
              {day}
              {hasEvent && <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-accent" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
