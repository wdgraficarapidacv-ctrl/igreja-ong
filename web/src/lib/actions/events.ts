"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "./require-admin";

function readForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    event_date: String(formData.get("event_date") ?? ""),
    start_time: nullify(formData.get("start_time")),
    location: nullify(formData.get("location")),
    description: nullify(formData.get("description")),
    responsible: nullify(formData.get("responsible")),
    ministry_id: nullify(formData.get("ministry_id")),
    image_url: nullify(formData.get("image_url")),
    status: String(formData.get("status") ?? "agendado"),
  };
}

function nullify(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str.length ? str : null;
}

function revalidateAll() {
  revalidatePath("/admin/agenda");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createEvent(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = readForm(formData);

  if (!payload.name || !payload.event_date) throw new Error("Preencha nome e data do evento.");

  const { error } = await supabase.from("events").insert(payload);
  if (error) throw new Error(error.message);

  revalidateAll();
  redirect("/admin/agenda");
}

export async function updateEvent(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = readForm(formData);

  if (!payload.name || !payload.event_date) throw new Error("Preencha nome e data do evento.");

  const { error } = await supabase.from("events").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidateAll();
  redirect("/admin/agenda");
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}
