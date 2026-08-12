"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "./require-admin";

function readForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    weekday: String(formData.get("weekday") ?? ""),
    start_time: String(formData.get("start_time") ?? ""),
    end_time: nullify(formData.get("end_time")),
    description: nullify(formData.get("description")),
    status: String(formData.get("status") ?? "ativo"),
    notes: nullify(formData.get("notes")),
  };
}

function nullify(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str.length ? str : null;
}

function revalidateAll() {
  revalidatePath("/admin/cultos");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createService(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = readForm(formData);

  if (!payload.name || !payload.weekday || !payload.start_time) {
    throw new Error("Preencha nome, dia da semana e horário inicial.");
  }

  const { error } = await supabase.from("services").insert(payload);
  if (error) throw new Error(error.message);

  revalidateAll();
  redirect("/admin/cultos");
}

export async function updateService(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = readForm(formData);

  if (!payload.name || !payload.weekday || !payload.start_time) {
    throw new Error("Preencha nome, dia da semana e horário inicial.");
  }

  const { error } = await supabase.from("services").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidateAll();
  redirect("/admin/cultos");
}

export async function toggleServiceStatus(id: string, currentStatus: string) {
  await requireAdmin();
  const supabase = await createClient();
  const nextStatus = currentStatus === "ativo" ? "inativo" : "ativo";
  const { error } = await supabase.from("services").update({ status: nextStatus }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function deleteService(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}
