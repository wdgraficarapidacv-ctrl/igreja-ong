"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createLocalAdmin, localAdminExists, verifyLocalAdminCredentials } from "@/lib/local-auth/store";
import { createLocalSessionToken, LOCAL_SESSION_COOKIE } from "@/lib/local-auth/session";

export type RegisterState = { error?: string } | undefined;

export async function registerLocalAdminAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  if (isSupabaseConfigured()) {
    return { error: "O Supabase já está configurado — crie o admin por lá (veja SETUP.md)." };
  }
  if (await localAdminExists()) {
    return { error: "Já existe um administrador cadastrado. Faça login." };
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!fullName || !email || !password) {
    return { error: "Preencha todos os campos." };
  }
  if (password.length < 8) {
    return { error: "A senha precisa ter pelo menos 8 caracteres." };
  }
  if (password !== confirm) {
    return { error: "As senhas não coincidem." };
  }

  await createLocalAdmin(email, password, fullName);

  const token = await createLocalSessionToken({ email, fullName });
  const cookieStore = await cookies();
  cookieStore.set(LOCAL_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/admin");
}

export type LocalLoginState = { error?: string } | undefined;

export async function loginLocalAction(
  _prevState: LocalLoginState,
  formData: FormData
): Promise<LocalLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { error: "Preencha e-mail e senha." };
  }

  const admin = await verifyLocalAdminCredentials(email, password);
  if (!admin) {
    return { error: "E-mail ou senha incorretos." };
  }

  const token = await createLocalSessionToken({ email: admin.email, fullName: admin.fullName });
  const cookieStore = await cookies();
  cookieStore.set(LOCAL_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(next.startsWith("/") ? next : "/admin");
}

export async function logoutLocalAction() {
  const cookieStore = await cookies();
  cookieStore.delete(LOCAL_SESSION_COOKIE);
  redirect("/login");
}
