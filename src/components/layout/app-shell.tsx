"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

import { SignOutButton } from "@/components/layout/sign-out-button";
import { Sidebar } from "@/components/ui/modern-side-bar";
import { SilkBackground } from "@/components/ui/silk-background-animation";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";

interface AppShellProps {
  title: string;
  subtitle?: string;
  userEmail?: string | null;
  avatarUrl?: string | null;
  maxWidth?: string;
  children: ReactNode;
}

export function AppShell({ title, subtitle, userEmail = null, avatarUrl = null, maxWidth = "max-w-7xl", children }: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="dark min-h-screen bg-transparent text-white">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <SilkBackground />
      </div>
      
      <button
        type="button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-4 top-4 z-30 rounded-md border border-gold-subtle bg-black/40 p-2.5 text-white shadow-gold-sm backdrop-blur-md transition-all hover:bg-gold/10 md:hidden"
        aria-label="Otwórz menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex min-h-screen">
        <Sidebar 
          userEmail={userEmail} 
          avatarUrl={avatarUrl} 
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-gold-subtle bg-black/40 backdrop-blur-md">
            <div className={cn("mx-auto flex w-full items-center justify-between px-4 py-4 md:px-8", maxWidth)}>
              <div className={cn(
                "transition-all duration-300 ease-in-out transform",
                // Show on mobile always, show on desktop only when collapsed
                "opacity-100 translate-x-0 ml-12 md:ml-0", 
                "md:opacity-0 md:-translate-x-4 pointer-events-none",
                isCollapsed && "md:opacity-100 md:translate-x-0 md:pointer-events-auto"
              )}>
                <Link
                  href="/dashboard"
                  className="font-display text-xl tracking-wide text-white"
                >
                  Faktura In
                </Link>
              </div>
              
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

          <main className={cn("mx-auto w-full flex-1 px-4 py-8 md:px-8", maxWidth)}>
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
