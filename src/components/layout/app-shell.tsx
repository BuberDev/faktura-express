import Link from "next/link";
import type { ReactNode } from "react";

import { SignOutButton } from "@/components/layout/sign-out-button";
import { Sidebar } from "@/components/ui/modern-side-bar";
import { SilkBackground } from "@/components/ui/silk-background-animation";
import { Search } from "lucide-react";

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
              
              <div className="hidden md:flex flex-1 mx-8 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <input 
                    type="text" 
                    placeholder="Szukaj faktur, klientów..." 
                    className="w-full h-10 bg-white/5 border border-gold-subtle rounded-full pl-10 pr-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <SignOutButton className="md:hidden" />
                <div className="hidden md:block">
                  <SignOutButton />
                </div>
              </div>
            </div>
            
            {/* Mobile search bar */}
            <div className="md:hidden px-4 pb-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <input 
                  type="text" 
                  placeholder="Szukaj faktur, klientów..." 
                  className="w-full h-10 bg-white/5 border border-gold-subtle rounded-full pl-10 pr-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
                />
              </div>
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
