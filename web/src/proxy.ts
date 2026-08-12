import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next.js 16 renomeou "middleware" para "proxy" (mesma funcionalidade).
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Roda em todas as rotas exceto assets estáticos, para poder
     * renovar a sessão em qualquer página — mas o redirecionamento
     * só é aplicado a /admin e /login (ver lib/supabase/proxy.ts).
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
