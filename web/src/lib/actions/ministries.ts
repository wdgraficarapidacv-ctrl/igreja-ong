"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "./require-admin";

function readForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: nullify(formData.get("description")),
    leader_name: nullify(formData.get("leader_name")),
    image_url: nullify(formData.get("image_url")),
    status: String(formData.get("status") ?? "ativo"),
  };
}

function nullify(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str.length ? str : null;
}

function revalidateAll() {
  revalidatePath("/admin/ministerios");
  revalidatePath("/admin/membros");
  revalidatePath("/");
}

export async function createMinistry(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = readForm(formData);

  if (!payload.name) throw new Error("Nome do ministério é obrigatório.");

  const { error } = await supabase.from("ministries").insert(payload);
  if (error) throw new Error(error.message);

  revalidateAll();
  redirect("/admin/ministerios");
}

export async function updateMinistry(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = readForm(formData);

  if (!payload.name) throw new Error("Nome do ministério é obrigatório.");

  const { error } = await supabase.from("ministries").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidateAll();
  redirect("/admin/ministerios");
}

export async function deleteMinistry(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("ministries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}
