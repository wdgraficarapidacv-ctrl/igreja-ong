"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { DoveMark } from "@/components/dove-mark";
import { signOutAction } from "@/app/login/actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/membros", label: "Membros", icon: "users" },
  { href: "/admin/financeiro", label: "Financeiro", icon: "coin" },
  { href: "/admin/cultos", label: "Cultos", icon: "candle" },
  { href: "/admin/celulas", label: "Células", icon: "home" },
  { href: "/admin/agenda", label: "Agenda", icon: "calendar" },
  { href: "/admin/ministerios", label: "Ministérios", icon: "spark" },
  { href: "/admin/filiais", label: "Filiais", icon: "pin" },
  { href: "/admin/avisos", label: "Avisos", icon: "bell" },
  { href: "/admin/configuracoes", label: "Configurações", icon: "gear" },
] as const;

export function AdminShell({
  adminName,
  localMode,
  children,
}: {
  adminName: string;
  localMode?: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg text-ink">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-line bg-bg-raised lg:flex">
        <SidebarContent pathname={pathname} adminName={adminName} />
      </aside>

      {/* Drawer mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Fechar menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <aside className="absolute left-0 top-0 flex h-full w-[260px] flex-col border-r border-line bg-bg-raised">
            <SidebarContent pathname={pathname} adminName={adminName} onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-bg-raised px-5 py-3.5 lg:hidden">
          <Link href="/admin" className="flex items-center gap-2 font-serif text-[17px] font-bold">
            <DoveMark className="h-7 w-7" />
            MARN
          </Link>
          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setDrawerOpen(true)}
            className="rounded-lg border border-line p-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
          {localMode && (
            <div className="mx-auto mb-6 max-w-[1200px] rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-[13px] text-warning">
              <strong>Modo local (sem Supabase):</strong> os dados ficam só nesta máquina, em{" "}
              <code>web/.local-data/</code>, e não são usados pelo site público nem sobrevivem a um deploy na Vercel.
              Configure o Supabase (<code>web/SETUP.md</code>) antes de publicar.
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  adminName,
  onNavigate,
}: {
  pathname: string;
  adminName: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="px-5 pb-6 pt-6">
        <Link href="/admin" className="flex items-center gap-2.5 font-serif text-lg font-bold">
          <DoveMark className="h-8 w-8" />
          <span>
            MARN
            <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-ink">
              Painel Administrativo
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14.5px] transition-colors ${
                active ? "bg-accent-soft text-accent-ink" : "text-ink-soft hover:bg-bg hover:text-ink"
              }`}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line px-3 py-4">
        <div className="mb-2 truncate px-3 text-[12.5px] text-ink-soft">{adminName}</div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14.5px] text-ink-soft transition-colors hover:bg-bg hover:text-danger"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sair
          </button>
        </form>
      </div>
    </>
  );
}

function NavIcon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />,
    users: (
      <>
        <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 20c1.2-3.4 4-5 6-5s4.8 1.6 6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="17" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.6" />
        <path d="M15.5 20c.7-2.3 2-3.7 3.5-4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
    coin: (
      <>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 8v8M9.5 9.5c0-1 1-1.5 2.5-1.5s2.5.6 2.5 1.6-1 1.3-2.5 1.7-2.5.8-2.5 1.8S10.7 15 12 15s2.5-.5 2.5-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
    candle: (
      <>
        <rect x="9" y="9" width="6" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 9V5M12 5c-1.2 0-2-1-1.4-2.2C11 2 12 2 12 2s1 0 1.4.8C13.9 4 13.2 5 12 5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </>
    ),
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 10h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
    spark: <path d="M12 3v4M12 17v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M3 12h4M17 12h4M4.2 19.8 7 17M17 7l2.8-2.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />,
    bell: (
      <>
        <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
    gear: (
      <>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
    pin: (
      <>
        <path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      </>
    ),
    home: (
      <>
        <path d="M4 11 12 4l8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 9.5V20h12V9.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M10 20v-6h4v6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </>
    ),
  };

  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="shrink-0">
      {paths[name]}
    </svg>
  );
}
