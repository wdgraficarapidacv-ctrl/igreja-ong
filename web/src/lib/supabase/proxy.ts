import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "./env";
import { LOCAL_SESSION_COOKIE, verifyLocalSessionToken } from "@/lib/local-auth/session";

/**
 * Renova a sessão Supabase a cada request e protege qualquer rota
 * /admin/*: sem sessão válida + admin cadastrado → redireciona pro /login.
 * Essa é a proteção "de verdade" (roda no servidor, antes da página
 * renderizar) — a RLS no banco é a segunda camada, para o caso de
 * alguém tentar chamar a API do Supabase diretamente.
 */
export async function updateSession(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/login";

  // Enquanto o Supabase não está configurado (ver SETUP.md), usa a sessão
  // local assinada (jose) como proteção real de /admin — não é apenas
  // "esconder no frontend", o cookie é verificado aqui no servidor.
  if (!isSupabaseConfigured()) {
    const token = request.cookies.get(LOCAL_SESSION_COOKIE)?.value;
    const session = token ? await verifyLocalSessionToken(token) : null;

    if (isAdminRoute && !session) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    if (isLoginRoute && session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Confirma que o usuário logado é realmente um admin cadastrado
    // (não basta estar autenticado — precisa existir em public.admins).
    const { data: admin } = await supabase
      .from("admins")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!admin) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "sem_permissao");
      return NextResponse.redirect(url);
    }
  }

  // Usuário já logado tentando ver a tela de login → manda pro painel
  if (isLoginRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
