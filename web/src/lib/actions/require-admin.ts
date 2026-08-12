import { getCurrentAdminSession } from "@/lib/auth/get-session";

/**
 * Segunda camada de defesa para toda Server Action de mutação:
 * mesmo que alguém burle o proxy e chegue até aqui, a action recusa
 * a operação se não houver um admin autenticado. A terceira camada
 * (a definitiva, no modo Supabase) é a RLS no Postgres, que bloqueia
 * a query mesmo que essa checagem seja removida por engano.
 */
export async function requireAdmin() {
  const session = await getCurrentAdminSession();
  if (!session) {
    throw new Error("Não autorizado: é preciso estar logado como administrador.");
  }
  if (session.mode === "local") {
    throw new Error(
      "Esta ação precisa do Supabase configurado (o modo local é só para testar o login). Veja web/SETUP.md."
    );
  }
  return session;
}
