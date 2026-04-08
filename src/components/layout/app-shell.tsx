"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

import { SignOutButton } from "@/components/layout/sign-out-button";
import { Sidebar } from "@/components/ui/modern-side-bar";
import { SilkBackground } from "@/components/ui/silk-background-animation";
import { Search, Menu, X } from "lucide-react";
import Image from "next/image";
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
    <div className="dark h-screen flex flex-col overflow-hidden bg-black text-white">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <SilkBackground />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          userEmail={userEmail} 
          avatarUrl={avatarUrl} 
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="relative z-20 border-b border-gold-subtle/20 bg-[#111111]">
            <div className={cn("mx-auto flex w-full items-center justify-between px-4 py-4 md:px-8", maxWidth)}>
              <button
                onClick={() => setIsMobileOpen(true)}
                className="absolute left-4 top-5 md:hidden z-50 rounded-md text-white/70 hover:bg-white/5 hover:text-white"
                aria-label="Toggle Sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className={cn(
                "transition-all duration-300 ease-in-out transform",
                "opacity-100 translate-x-0 ml-10 md:ml-0", 
                "md:opacity-0 md:-translate-x-4 pointer-events-none",
                isCollapsed && "md:opacity-100 md:translate-x-0 md:pointer-events-auto"
              )}>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 font-display text-xl tracking-wide text-gold-metallic bg-clip-text"
                >
                  <div className="md:hidden relative h-8 w-8 shrink-0">
                    <Image 
                      src="/logo.svg" 
                      alt="Logo" 
                      fill 
                      className="object-contain"
                    />
                  </div>
                  <span>Faktura In</span>
                </Link>
              </div>
              
              <div className="hidden md:flex flex-1 mx-8 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/50" />
                  <input 
                    type="text" 
                    placeholder="Szukaj faktur, klientów..." 
                    className="w-full h-10 bg-white/5 border border-gold-subtle/50 rounded-full pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
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
            
            <div className="md:hidden px-4 pb-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/50" />
                <input 
                  type="text" 
                  placeholder="Szukaj faktur, klientów..." 
                  className="w-full h-10 bg-white/5 border border-gold-subtle/50 rounded-full pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
                />
              </div>
            </div>
          </header>

          <main className={cn("mx-auto w-full flex-1 overflow-y-auto px-4 py-8 md:px-8 custom-scrollbar", maxWidth)}>
            <section className="mb-6 space-y-1">
              <h1 className="font-display text-3xl tracking-tight text-white">{title}</h1>
              {subtitle ? <p className="text-sm text-white/50">{subtitle}</p> : null}
            </section>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
