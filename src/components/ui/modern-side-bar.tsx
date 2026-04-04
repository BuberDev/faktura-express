"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  FilePlus2,
  FileText,
  Home,
  LogOut,
  UserRound,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/infrastructure/supabase/browser-client";
import { hasSupabaseEnvironment } from "@/infrastructure/supabase/env";

interface NavigationItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

interface SidebarProps {
  className?: string;
  userEmail?: string | null;
  avatarUrl?: string | null;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}

const navigationItems: NavigationItem[] = [
  { href: "/dashboard", label: "Panel główny", icon: Home },
  { href: "/invoices", label: "Faktury", icon: FileText },
  { href: "/invoices/new", label: "Nowa faktura", icon: FilePlus2 },
  { href: "/settings/profile", label: "Profil", icon: UserRound },
  { href: "/settings/company-data", label: "Dane firmy", icon: Building2 },
];

function getEmailShortName(userEmail: string | null | undefined): string {
  if (!userEmail) {
    return "Użytkownik";
  }

  return userEmail.split("@")[0] ?? userEmail;
}

function getEmailInitials(userEmail: string | null | undefined): string {
  const shortName = getEmailShortName(userEmail);
  const letters = shortName
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((chunk) => chunk[0]?.toUpperCase())
    .filter(Boolean);

  if (letters.length === 0) {
    return "U";
  }

  return letters.slice(0, 2).join("");
}

function isRouteActive(currentPathname: string, itemHref: string): boolean {
  if (itemHref === "/dashboard") {
    return currentPathname.startsWith("/dashboard");
  }

  if (itemHref === "/invoices") {
    return (
      currentPathname === "/invoices" ||
      (/^\/invoices\/[^/]+$/.test(currentPathname) && currentPathname !== "/invoices/new")
    );
  }

  return currentPathname === itemHref;
}

export function Sidebar({ 
  className = "", 
  userEmail = null, 
  avatarUrl = null,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut(): Promise<void> {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    if (hasSupabaseEnvironment) {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    }

    router.push("/auth/login");
    router.refresh();
    setIsSigningOut(false);
  }

  function closeMobileSidebar() {
    setIsMobileOpen(false);
  }

  return (
    <>
      <AnimatePresence>
        {isMobileOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileSidebar}
              className="fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm md:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#E5E5E5] bg-gradient-to-b from-white to-[#F9F9F9] dark:border-[#262626] dark:bg-dark-surface md:hidden",
                className
              )}
            >
              <div className="flex h-full w-full flex-col">
                <div className="flex items-center justify-between border-b border-[#E5E5E5] p-4 dark:border-[#262626]">
                  <div>
                    <p className="font-display text-xl text-black dark:text-white">Faktura In</p>
                    <p className="text-xs text-black/60 dark:text-white/60">Panel aplikacji</p>
                  </div>
                  <button
                    type="button"
                    onClick={closeMobileSidebar}
                    className="rounded-md border border-gold-subtle p-2 text-black transition-colors hover:bg-gold/10 dark:text-white"
                    aria-label="Zamknij menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {/* Same Nav as Desktop */}
                <NavContent 
                  pathname={pathname} 
                  isCollapsed={false} 
                  closeMobileSidebar={closeMobileSidebar} 
                  isSigningOut={isSigningOut}
                  userEmail={userEmail}
                  avatarUrl={avatarUrl}
                  handleSignOut={handleSignOut}
                />
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <aside
        className={cn(
          "hidden h-full flex-col border-r border-[#E5E5E5] bg-gradient-to-b from-white to-[#F9F9F9] dark:border-[#262626] dark:bg-dark-surface md:flex",
          isCollapsed ? "w-20" : "w-72",
          className
        )}
      >
        <div className="flex h-full w-full flex-col">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] p-4 dark:border-[#262626]">
            <div className={cn("overflow-hidden", isCollapsed ? "hidden" : "block")}>
              <p className="font-display text-xl text-black dark:text-white">Faktura In</p>
              <p className="text-xs text-black/60 dark:text-white/60">Panel aplikacji</p>
            </div>

            <button
              type="button"
              onClick={() => setIsCollapsed((value) => !value)}
              className="rounded-md border border-gold-subtle p-1.5 transition-colors hover:bg-gold/10"
              aria-label={isCollapsed ? "Rozwiń sidebar" : "Zwiń sidebar"}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          <NavContent 
            pathname={pathname} 
            isCollapsed={isCollapsed} 
            closeMobileSidebar={closeMobileSidebar} 
            isSigningOut={isSigningOut}
            userEmail={userEmail}
            avatarUrl={avatarUrl}
            handleSignOut={handleSignOut}
          />
        </div>
      </aside>
    </>
  );
}

function NavContent({ 
  pathname, 
  isCollapsed, 
  closeMobileSidebar, 
  isSigningOut, 
  userEmail, 
  avatarUrl,
  handleSignOut 
}: any) {
  return (
    <>
      <nav className="flex-1 space-y-1 p-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isRouteActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobileSidebar}
              className={cn(
                "group flex items-center rounded-md border px-3 py-2.5 text-sm transition-all",
                isCollapsed ? "justify-center px-2" : "gap-2.5",
                active
                  ? "border-gold-subtle bg-gold/15 text-black shadow-gold-sm dark:text-white"
                  : "border-transparent text-black/75 hover:border-gold-subtle hover:bg-gold/10 hover:text-black dark:text-white/75 dark:hover:text-white",
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active
                    ? "text-gold-dark dark:text-gold-light"
                    : "text-black/65 group-hover:text-gold-dark dark:text-white/65 dark:group-hover:text-gold-light",
                )}
              />
              <span className={cn(isCollapsed ? "hidden" : "inline")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#E5E5E5] p-3 dark:border-[#262626]">
        <div
          className={cn(
            "mb-3 flex items-center rounded-md border border-gold-subtle bg-gold/5 p-2.5",
            isCollapsed ? "justify-center" : "gap-2.5",
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold-subtle bg-gold-metallic text-xs font-semibold text-black">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userEmail || "User"}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              getEmailInitials(userEmail)
            )}
          </div>
          <div className={cn("min-w-0", isCollapsed ? "hidden" : "block")}>
            <p className="truncate text-sm font-medium">{getEmailShortName(userEmail)}</p>
            <p className="truncate text-xs text-black/60 dark:text-white/60">{userEmail || "Brak adresu e-mail"}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void handleSignOut()}
          disabled={isSigningOut}
          className={cn(
            "flex w-full items-center rounded-md border border-gold-subtle px-3 py-2.5 text-sm text-black transition-colors hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-70 dark:text-white",
            isCollapsed ? "justify-center px-2" : "gap-2.5",
          )}
          title={isCollapsed ? "Wyloguj" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0 text-gold-dark dark:text-gold-light" />
          <span className={cn(isCollapsed ? "hidden" : "inline")}>
            {isSigningOut ? "Wylogowywanie..." : "Wyloguj"}
          </span>
        </button>
      </div>
    </>
  );
}
