import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentAdminSession } from "@/lib/auth/get-session";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata = { title: "Painel Administrativo" };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // O proxy (src/proxy.ts) já bloqueia /admin/* sem sessão — esta checagem
  // aqui é a segunda camada, mais próxima dos dados (defesa em profundidade).
  const session = await getCurrentAdminSession();

  if (!session) {
    redirect("/login?next=/admin");
  }

  return (
    <AdminShell adminName={session.fullName} localMode={session.mode === "local"}>
      {children}
    </AdminShell>
  );
}
