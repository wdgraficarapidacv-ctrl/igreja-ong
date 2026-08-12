"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "./require-admin";

function readMemberForm(formData: FormData) {
  return {
    full_name: String(formData.get("full_name") ?? "").trim(),
    photo_url: emptyToNull(formData.get("photo_url")),
    birth_date: emptyToNull(formData.get("birth_date")),
    phone: emptyToNull(formData.get("phone")),
    whatsapp: emptyToNull(formData.get("whatsapp")),
    email: emptyToNull(formData.get("email")),
    address: emptyToNull(formData.get("address")),
    joined_at: emptyToNull(formData.get("joined_at")),
    baptized: formData.get("baptized") === "on",
    ministry_id: emptyToNull(formData.get("ministry_id")),
    role_title: emptyToNull(formData.get("role_title")),
    status: String(formData.get("status") ?? "ativo"),
    notes: emptyToNull(formData.get("notes")),
  };
}

function emptyToNull(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str.length ? str : null;
}

export async function createMember(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = readMemberForm(formData);

  if (!payload.full_name) throw new Error("Nome completo é obrigatório.");

  const { error } = await supabase.from("members").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/membros");
  redirect("/admin/membros");
}

export async function updateMember(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = readMemberForm(formData);

  if (!payload.full_name) throw new Error("Nome completo é obrigatório.");

  const { error } = await supabase
    .from("members")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/membros");
  redirect("/admin/membros");
}

export async function deleteMember(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/membros");
}
