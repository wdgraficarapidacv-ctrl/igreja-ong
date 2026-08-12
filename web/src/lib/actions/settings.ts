"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "./require-admin";

function nullify(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str.length ? str : null;
}

export type SettingsState = { success?: boolean; error?: string } | undefined;

export async function updateSettings(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireAdmin();
  const supabase = await createClient();

  const churchName = String(formData.get("church_name") ?? "").trim();
  if (!churchName) return { error: "O nome da igreja é obrigatório." };

  const payload = {
    id: 1,
    church_name: churchName,
    logo_url: nullify(formData.get("logo_url")),
    description: nullify(formData.get("description")),
    whatsapp: nullify(formData.get("whatsapp")),
    phone: nullify(formData.get("phone")),
    email: nullify(formData.get("email")),
    address: nullify(formData.get("address")),
    instagram_url: nullify(formData.get("instagram_url")),
    facebook_url: nullify(formData.get("facebook_url")),
    youtube_url: nullify(formData.get("youtube_url")),
    footer_text: nullify(formData.get("footer_text")),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("church_settings").upsert(payload, { onConflict: "id" });
  if (error) return { error: error.message };

  revalidatePath("/admin/configuracoes");
  revalidatePath("/");
  return { success: true };
}
