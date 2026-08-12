import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "./env";

/**
 * Cliente Supabase para uso em Server Components, Server Actions
 * e Route Handlers. Lê/escreve a sessão via cookies do Next.js.
 */
export async function createClient() {
  const cookieStore = await cookies();

  // Sem Supabase configurado ainda (modo local, ver SETUP.md): usa valores
  // de placeholder pra não derrubar a construção do client. As chamadas
  // de rede vão falhar de forma "silenciosa" (retornam { data: null, error }
  // em vez de lançar exceção), então as páginas caem no estado vazio normal.
  const url = isSupabaseConfigured() ? process.env.NEXT_PUBLIC_SUPABASE_URL! : "https://placeholder.supabase.co";
  const key = isSupabaseConfigured() ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! : "placeholder-anon-key";

  return createServerClient(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // chamado a partir de um Server Component (sem permissão de
            // escrita) — o middleware já cuida de renovar a sessão.
          }
        },
      },
    }
  );
}

/**
 * Confere se o usuário autenticado atual é admin (via tabela public.admins,
 * protegida por RLS). Retorna null se não estiver logado, não for admin, ou
 * se o Supabase ainda não tiver sido configurado (ver SETUP.md).
 */
export async function getAdminSession() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: admin } = await supabase
    .from("admins")
    .select("id, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) return null;

  return { user, admin };
}
