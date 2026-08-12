"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "./require-admin";

function readForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "MARN CHURCH").trim(),
    city: String(formData.get("city") ?? "").trim(),
    state: nullify(formData.get("state")),
    country: String(formData.get("country") ?? "Brasil").trim() || "Brasil",
    address: nullify(formData.get("address")),
    whatsapp: nullify(formData.get("whatsapp")),
    is_headquarters: formData.get("is_headquarters") === "on",
    status: String(formData.get("status") ?? "ativo"),
  };
}

function nullify(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str.length ? str : null;
}

function revalidateAll() {
  revalidatePath("/admin/filiais");
  revalidatePath("/filiais");
}

export async function createBranch(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = readForm(formData);

  if (!payload.city) throw new Error("Informe a cidade da unidade.");

  const { error } = await supabase.from("branches").insert(payload);
  if (error) throw new Error(error.message);

  revalidateAll();
  redirect("/admin/filiais");
}

export async function updateBranch(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = readForm(formData);

  if (!payload.city) throw new Error("Informe a cidade da unidade.");

  const { error } = await supabase.from("branches").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidateAll();
  redirect("/admin/filiais");
}

export async function deleteBranch(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("branches").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}
