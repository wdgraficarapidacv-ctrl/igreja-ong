import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getAdminSession as getSupabaseAdminSession } from "@/lib/supabase/server";
import { LOCAL_SESSION_COOKIE, verifyLocalSessionToken } from "@/lib/local-auth/session";

export type AdminSession = {
  id?: string;
  fullName: string;
  email: string;
  mode: "supabase" | "local";
};

/**
 * Ponto único para descobrir quem está logado, seja no modo Supabase
 * (produção, com RLS) ou no modo local (teste, sem Supabase configurado).
 */
export async function getCurrentAdminSession(): Promise<AdminSession | null> {
  if (isSupabaseConfigured()) {
    const session = await getSupabaseAdminSession();
    if (!session) return null;
    return { id: session.user.id, fullName: session.admin.full_name, email: session.user.email ?? "", mode: "supabase" };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(LOCAL_SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifyLocalSessionToken(token);
  if (!payload) return null;

  return { fullName: payload.fullName, email: payload.email, mode: "local" };
}
