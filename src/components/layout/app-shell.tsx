import Link from "next/link";
import type { ReactNode } from "react";

import { SignOutButton } from "@/components/layout/sign-out-button";
import { Sidebar } from "@/components/ui/modern-side-bar";
import { SilkBackground } from "@/components/ui/silk-background-animation";

interface AppShellProps {
  title: string;
  subtitle?: string;
  userEmail?: string | null;
  avatarUrl?: string | null;
  children: ReactNode;
}

export function AppShell({ title, subtitle, userEmail = null, avatarUrl = null, children }: AppShellProps) {
  return (
    <div className="dark min-h-screen bg-transparent text-white">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <SilkBackground />
      </div>
      <div className="flex min-h-screen">
        <Sidebar userEmail={userEmail} avatarUrl={avatarUrl} />

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-gold-subtle bg-black/40 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
              <Link
                href="/dashboard"
                className="pl-12 font-display text-xl tracking-wide text-white md:pl-0"
              >
                Faktura In
              </Link>
              <SignOutButton className="md:hidden" />
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
            <section className="mb-6 space-y-1">
              <h1 className="font-display text-3xl tracking-tight text-white">{title}</h1>
              {subtitle ? <p className="text-sm text-white/65">{subtitle}</p> : null}
            </section>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
