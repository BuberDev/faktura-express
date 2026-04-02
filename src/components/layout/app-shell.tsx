import Link from "next/link";
import type { ReactNode } from "react";

import { SignOutButton } from "@/components/layout/sign-out-button";

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const navigationItems = [
  { href: "/dashboard", label: "Panel" },
  { href: "/invoices", label: "Faktury" },
  { href: "/invoices/new", label: "Nowa faktura" },
  { href: "/settings/profile", label: "Profil" },
  { href: "/settings/company-data", label: "Dane firmy" },
];

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <header className="border-b border-gold-subtle bg-gradient-to-r from-white via-[#FCF6BA]/40 to-white dark:bg-dark-surface">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div>
            <Link href="/" className="font-display text-xl tracking-wide text-black dark:text-white">
              Faktura Express
            </Link>
          </div>
          <nav className="hidden items-center gap-2 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-black/70 transition hover:bg-gold/10 hover:text-black dark:text-white/80"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <SignOutButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
        <section className="mb-6 space-y-1">
          <h1 className="font-display text-3xl tracking-tight">{title}</h1>
          {subtitle ? <p className="text-sm text-black/65 dark:text-white/65">{subtitle}</p> : null}
        </section>
        {children}
      </main>
    </div>
  );
}
