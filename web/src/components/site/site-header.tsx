"use client";

import Link from "next/link";
import { useState } from "react";
import { DoveMark } from "@/components/dove-mark";
import { whatsappLink } from "@/lib/whatsapp";

const NAV_LINKS = [
  { href: "/sobre", label: "Sobre" },
  { href: "/#cultos", label: "Cultos" },
  { href: "/#ministerios", label: "Ministérios" },
  { href: "/filiais", label: "Filiais" },
  { href: "/projetos-sociais", label: "Projetos Sociais" },
  { href: "/#local", label: "Localização" },
  { href: "/#contato", label: "Contato" },
];

export function SiteHeader({ whatsapp }: { whatsapp: string | null }) {
  const [open, setOpen] = useState(false);
  const waHref = whatsappLink(whatsapp);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 font-serif text-[19px] font-bold tracking-tight">
          <DoveMark className="h-8 w-8 shrink-0" />
          <span>
            MARN
            <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-ink">
              Igreja Apostólica · Since 2012
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-[14.5px] md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-ink-soft transition-colors hover:text-ink">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-full border border-line px-4 py-2 text-[14px] font-semibold text-ink-soft transition-colors hover:border-accent hover:text-accent-ink"
          >
            Entrar
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-[18px] py-2.5 text-[14px] font-bold text-accent-contrast shadow-[0_4px_14px_rgba(79,199,232,0.35)] transition-colors hover:bg-accent-ink"
          >
            Fale no WhatsApp
          </a>
        </div>

        <button
          type="button"
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg border border-line p-2 text-ink md:hidden"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-line px-6 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-[15px] text-ink-soft hover:bg-bg-raised hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-full border border-line px-4 py-2.5 text-center text-[14px] font-semibold text-ink-soft"
            >
              Entrar
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-4 py-2.5 text-center text-[14px] font-bold text-accent-contrast"
            >
              Fale no WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
