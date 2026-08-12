import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: ReactNode;
  tone?: "default" | "positive" | "negative";
}) {
  const valueColor = tone === "positive" ? "text-success" : tone === "negative" ? "text-danger" : "text-ink";

  return (
    <div className="rounded-2xl border border-line bg-bg-raised p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent-soft text-accent-ink">
        {icon}
      </div>
      <p className="text-[13px] font-medium text-ink-soft">{label}</p>
      <p className={`mt-1 font-serif text-[28px] font-normal leading-tight ${valueColor}`}>{value}</p>
      {hint && <p className="mt-1 text-[12.5px] text-ink-soft">{hint}</p>}
    </div>
  );
}
