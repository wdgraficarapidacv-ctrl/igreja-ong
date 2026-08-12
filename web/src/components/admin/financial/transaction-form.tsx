"use client";

import { useState } from "react";
import { Field, FormCard, SelectField, SubmitButton, TextAreaField } from "@/components/admin/ui/form-fields";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants/financial";

type Transaction = {
  type: string;
  category: string;
  description: string | null;
  amount: number;
  transaction_date: string;
  notes: string | null;
};

export function TransactionForm({
  action,
  transaction,
  title,
}: {
  action: (formData: FormData) => Promise<void>;
  transaction?: Transaction;
  title: string;
}) {
  const [type, setType] = useState(transaction?.type ?? "entrada");
  const categories = type === "entrada" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <FormCard title={title}>
      <form action={action} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">Tipo</span>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-[10px] border border-line bg-bg px-3.5 py-2.5 text-[14.5px] text-ink outline-none focus:border-accent"
            >
              <option value="entrada">Entrada</option>
              <option value="despesa">Despesa</option>
            </select>
          </label>
          <SelectField label="Categoria" name="category" defaultValue={transaction?.category} required>
            <option value="" disabled>
              Selecione…
            </option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Valor (R$)" name="amount" type="number" step="0.01" defaultValue={transaction?.amount} required />
          <Field label="Data" name="transaction_date" type="date" defaultValue={transaction?.transaction_date} required />
        </div>

        <Field label="Descrição" name="description" defaultValue={transaction?.description} placeholder="Ex: Dízimo — culto de domingo" />
        <TextAreaField label="Observação" name="notes" defaultValue={transaction?.notes} rows={3} />

        <div className="mt-2 flex gap-3">
          <SubmitButton>Salvar</SubmitButton>
        </div>
      </form>
    </FormCard>
  );
}
