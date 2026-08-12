"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type LoginState = { error?: string } | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!isSupabaseConfigured()) {
    return { error: "O painel administrativo ainda não foi configurado. Veja web/SETUP.md." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { error: "Preencha e-mail e senha." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "E-mail ou senha incorretos." };
  }

  // Confirma que esse usuário é realmente um administrador cadastrado —
  // não basta autenticar no Supabase, precisa existir em public.admins.
  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    return { error: "Esse usuário não tem permissão de administrador." };
  }

  redirect(next.startsWith("/") ? next : "/admin");
}

export type ResetState = { message?: string; error?: string } | undefined;

export async function requestPasswordResetAction(
  _prevState: ResetState,
  formData: FormData
): Promise<ResetState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Modo local não envia e-mail de redefinição. Apague o arquivo web/.local-data/admin.json e crie a conta de novo.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Informe seu e-mail." };

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/login/reset-password`,
  });

  // Sempre retorna a mesma mensagem, exista ou não o e-mail —
  // evita confirmar quais e-mails têm conta administrativa.
  return { message: "Se esse e-mail estiver cadastrado, você vai receber um link para redefinir a senha." };
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } else {
    const { cookies } = await import("next/headers");
    const { LOCAL_SESSION_COOKIE } = await import("@/lib/local-auth/session");
    const cookieStore = await cookies();
    cookieStore.delete(LOCAL_SESSION_COOKIE);
  }
  redirect("/login");
}
