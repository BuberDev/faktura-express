import Link from "next/link";
import type { ReactNode } from "react";

import { SignOutButton } from "@/components/layout/sign-out-button";
import { Sidebar } from "@/components/ui/modern-side-bar";

interface AppShellProps {
  title: string;
  subtitle?: string;
  userEmail?: string | null;
  avatarUrl?: string | null;
  children: ReactNode;
}

export function AppShell({ title, subtitle, userEmail = null, avatarUrl = null, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="flex min-h-screen">
        <Sidebar userEmail={userEmail} avatarUrl={avatarUrl} />

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-gold-subtle bg-gradient-to-r from-white via-[#FCF6BA]/35 to-white dark:bg-dark-surface">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
              <Link
                href="/dashboard"
                className="pl-12 font-display text-xl tracking-wide text-black md:pl-0 dark:text-white"
              >
                Faktura In
              </Link>
              <SignOutButton className="md:hidden" />
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
            <section className="mb-6 space-y-1">
              <h1 className="font-display text-3xl tracking-tight">{title}</h1>
              {subtitle ? <p className="text-sm text-black/65 dark:text-white/65">{subtitle}</p> : null}
            </section>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
