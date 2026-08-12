"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Point = { mes: string; entradas: number; despesas: number };

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export function DashboardChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barGap={6} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid stroke="var(--line)" vertical={false} />
        <XAxis
          dataKey="mes"
          stroke="var(--ink-soft)"
          tickLine={false}
          axisLine={{ stroke: "var(--line)" }}
          fontSize={12}
        />
        <YAxis
          stroke="var(--ink-soft)"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}k` : String(v))}
        />
        <Tooltip
          cursor={{ fill: "var(--bg)" }}
          contentStyle={{
            background: "var(--bg-raised-2)",
            border: "1px solid var(--line)",
            borderRadius: 10,
            fontSize: 13,
          }}
          labelStyle={{ color: "var(--ink)" }}
          formatter={(value) => currency.format(Number(value ?? 0))}
        />
        <Bar dataKey="entradas" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Entradas" />
        <Bar dataKey="despesas" fill="var(--danger)" radius={[4, 4, 0, 0]} name="Despesas" />
      </BarChart>
    </ResponsiveContainer>
  );
}
