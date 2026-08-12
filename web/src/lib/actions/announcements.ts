"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "./require-admin";

function readForm(formData: FormData) {
  const publishAt = String(formData.get("publish_at") ?? "");
  const expireAt = String(formData.get("expire_at") ?? "");

  return {
    title: String(formData.get("title") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    image_url: nullify(formData.get("image_url")),
    publish_at: publishAt ? new Date(publishAt).toISOString() : new Date().toISOString(),
    expire_at: expireAt ? new Date(expireAt).toISOString() : null,
    status: String(formData.get("status") ?? "rascunho"),
  };
}

function nullify(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str.length ? str : null;
}

function revalidateAll() {
  revalidatePath("/admin/avisos");
  revalidatePath("/");
}

export async function createAnnouncement(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = readForm(formData);

  if (!payload.title || !payload.body) throw new Error("Preencha título e texto do aviso.");

  const { error } = await supabase.from("announcements").insert(payload);
  if (error) throw new Error(error.message);

  revalidateAll();
  redirect("/admin/avisos");
}

export async function updateAnnouncement(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = readForm(formData);

  if (!payload.title || !payload.body) throw new Error("Preencha título e texto do aviso.");

  const { error } = await supabase.from("announcements").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidateAll();
  redirect("/admin/avisos");
}

export async function deleteAnnouncement(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}
