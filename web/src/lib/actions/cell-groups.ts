"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "./require-admin";

function readForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    leader_name: String(formData.get("leader_name") ?? "").trim(),
    city: nullify(formData.get("city")),
    neighborhood: nullify(formData.get("neighborhood")),
    address: nullify(formData.get("address")),
    weekday: nullify(formData.get("weekday")),
    meeting_time: nullify(formData.get("meeting_time")),
    whatsapp: nullify(formData.get("whatsapp")),
    people_count: Number(formData.get("people_count") ?? 0) || 0,
    status: String(formData.get("status") ?? "ativo"),
  };
}

function nullify(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str.length ? str : null;
}

function revalidateAll() {
  revalidatePath("/admin/celulas");
  revalidatePath("/");
}

export async function createCellGroup(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = readForm(formData);

  if (!payload.name || !payload.leader_name) {
    throw new Error("Preencha nome da célula e nome do líder.");
  }

  const { error } = await supabase.from("cell_groups").insert(payload);
  if (error) throw new Error(error.message);

  revalidateAll();
  redirect("/admin/celulas");
}

export async function updateCellGroup(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = readForm(formData);

  if (!payload.name || !payload.leader_name) {
    throw new Error("Preencha nome da célula e nome do líder.");
  }

  const { error } = await supabase
    .from("cell_groups")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidateAll();
  redirect("/admin/celulas");
}

export async function deleteCellGroup(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("cell_groups").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}
