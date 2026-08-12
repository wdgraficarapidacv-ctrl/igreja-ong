"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "./require-admin";

function readForm(formData: FormData) {
  return {
    type: String(formData.get("type") ?? "entrada"),
    category: String(formData.get("category") ?? "").trim(),
    description: nullify(formData.get("description")),
    amount: Number(formData.get("amount") ?? 0),
    transaction_date: String(formData.get("transaction_date") ?? ""),
    notes: nullify(formData.get("notes")),
  };
}

function nullify(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str.length ? str : null;
}

export async function createTransaction(formData: FormData) {
  const session = await requireAdmin();
  const supabase = await createClient();
  const payload = readForm(formData);

  if (!payload.category || !payload.transaction_date || !(payload.amount > 0)) {
    throw new Error("Preencha categoria, valor e data corretamente.");
  }

  const { error } = await supabase.from("financial_transactions").insert({ ...payload, created_by: session.id });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/financeiro");
  revalidatePath("/admin");
  redirect("/admin/financeiro");
}

export async function updateTransaction(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = readForm(formData);

  if (!payload.category || !payload.transaction_date || !(payload.amount > 0)) {
    throw new Error("Preencha categoria, valor e data corretamente.");
  }

  const { error } = await supabase.from("financial_transactions").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/financeiro");
  revalidatePath("/admin");
  redirect("/admin/financeiro");
}

export async function deleteTransaction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("financial_transactions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/financeiro");
  revalidatePath("/admin");
}
