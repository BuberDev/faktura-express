"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ComponentType, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FilePlus2,
  FileText,
  Home,
  LogOut,
  UserRound,
  X,
  ShoppingBasket,
  PiggyBank,
  Calculator,
  Package,
  Users,
  Settings,
  HelpCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { getSupabaseBrowserClient } from "@/infrastructure/supabase/browser-client";
import { hasSupabaseEnvironment } from "@/infrastructure/supabase/env";

interface NavigationSubItem {
  href: string;
  label: string;
}

interface NavigationItem {
  href?: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  subItems?: NavigationSubItem[];
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
  { href: "/dashboard", label: "Start", icon: Home },
  {
    label: "Przychody",
    icon: FilePlus2,
    subItems: [
      { href: "/invoices/sales", label: "Faktury sprzedaży" },
      { href: "/invoices/bills", label: "Rachunki" },
      { href: "/invoices/receipts", label: "Paragony" },
      { href: "/invoices/proforma", label: "Faktury proforma" },
      { href: "/invoices/offers", label: "Oferty" },
    ],
  },
  {
    label: "Koszty",
    icon: ShoppingBasket,
    subItems: [
      { href: "/costs/invoices", label: "Faktury kosztowe" },
      { href: "/costs/purchases", label: "Faktury zakupu" },
      { href: "/costs/orders", label: "Zamówienia u dostawców" },
      { href: "/costs/ksef", label: "Faktury z KSeF" },
    ],
  },
  { href: "/payments", label: "Płatności", icon: PiggyBank },
  {
    label: "Księgowość",
    icon: Calculator,
    subItems: [
      { href: "/accounting/vat-sales", label: "Rejestr VAT sprzedaży" },
      { href: "/accounting/vat-purchases", label: "Rejestr VAT zakupów" },
      { href: "/accounting/revenues", label: "Ewidencja przychodów" },
      { href: "/accounting/costs", label: "Ewidencja kosztów" },
    ],
  },
  { href: "/products", label: "Usługi i Towary", icon: Package },
  { href: "/clients", label: "Kontrahenci", icon: Users },
  {
    label: "Ustawienia",
    icon: Settings,
    subItems: [
      { href: "/settings/payment-methods", label: "Formy płatności" },
      { href: "/settings/bank-accounts", label: "Rachunki bankowe" },
      { href: "/settings/fiscal-printer", label: "Drukarka fiskalna" },
      { href: "/settings/payment-terminal", label: "Terminal płatniczy" },
      { href: "/settings/profile", label: "Profil" },
      { href: "/settings/company-data", label: "Dane firmy" },
    ],
  },
  {
    label: "Pomoc",
    icon: HelpCircle,
    subItems: [
      { href: "/help", label: "Centrum pomocy" }
    ],
  },
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

function isRouteActive(currentPathname: string, item: NavigationItem): boolean {
  if (item.href && currentPathname === item.href) {
    return true;
  }
  
  if (item.subItems?.some(sub => currentPathname.startsWith(sub.href))) {
    return true;
  }
  
  if (item.href && item.href !== "/" && currentPathname.startsWith(item.href)) {
    return true;
  }

  return false;
}

export function Sidebar({
  className = "",
  userEmail = null,
  avatarUrl = null,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
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
                "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gold-subtle/30 bg-black dark:bg-dark-surface md:hidden",
                className
              )}
            >
              <div className="flex h-full w-full flex-col">
                <div className="flex items-center justify-between border-b border-gold-subtle/30 p-4 dark:border-gold-subtle/30">
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 shrink-0">
                      <Image 
                        src="/logo.svg" 
                        alt="Logo" 
                        fill 
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-display text-xl leading-tight text-gold-metallic bg-clip-text">Faktura In</p>
                      <p className="text-[10px] uppercase tracking-wider text-white/40">Panel aplikacji</p>
                    </div>
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
          "hidden h-screen sticky top-0 flex-col border-r border-gold-subtle/30 bg-black dark:bg-dark-surface md:flex",
          isCollapsed ? "w-20" : "w-72",
          className
        )}
      >
        <div className="flex h-full w-full flex-col">
          <div className="flex items-center border-b border-gold-subtle/30 p-4 dark:border-gold-subtle/30 h-[73px]">
            <div className={cn("flex flex-row items-center gap-3 transition-all duration-300 w-full", isCollapsed ? "justify-center" : "justify-start")}>
              <div className="relative h-8 w-8 shrink-0">
                <Image 
                  src="/logo.svg" 
                  alt="Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden whitespace-nowrap opacity-100 transition-opacity duration-300">
                  <p className="font-display text-xl leading-tight text-gold-metallic bg-clip-text">Faktura In</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">Panel aplikacji</p>
                </div>
              )}
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
  handleSignOut,
}: any) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Rozwiń początkowo aktywne menu (Accordion)
    const initialState: Record<string, boolean> = {};
    navigationItems.forEach((item) => {
      if (item.subItems && isRouteActive(pathname, item)) {
        initialState[item.label] = true;
      }
    });
    setExpandedItems(initialState);
  }, [pathname]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 custom-scrollbar">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isRouteActive(pathname, item);
            const isExpanded = expandedItems[item.label] || false;
            
            // Jesli sidebar jest zwinięty, nie renderuj subItems tylko tooltip
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={item.label} className="w-full">
                {hasSubItems ? (
                  <button
                    onClick={() => toggleExpand(item.label)}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-sm transition-all text-left",
                      isCollapsed ? "justify-center px-2" : "gap-2.5",
                      active && !isExpanded
                        ? "border-gold-subtle bg-gold/5 text-black shadow-gold-sm dark:text-white"
                        : "border-transparent text-black/75 hover:border-gold-subtle hover:bg-gold/10 hover:text-black dark:text-white/75 dark:hover:text-white"
                    )}
                  >
                    <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-2.5")}>
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active
                            ? "text-gold-dark dark:text-gold-light"
                            : "text-black/65 group-hover:text-gold-dark dark:text-white/65 dark:group-hover:text-gold-light"
                        )}
                      />
                      <span className={cn(isCollapsed ? "hidden" : "inline font-medium")}>{item.label}</span>
                    </div>
                    {!isCollapsed && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-black/40 transition-transform dark:text-white/40",
                          isExpanded && "rotate-180"
                        )}
                      />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href!}
                    onClick={closeMobileSidebar}
                    className={cn(
                      "group flex items-center rounded-md border px-3 py-2.5 text-sm transition-all",
                      isCollapsed ? "justify-center px-2" : "gap-2.5",
                      active
                        ? "border-gold-subtle bg-gold/15 text-black shadow-gold-sm dark:text-white font-medium"
                        : "border-transparent text-black/75 hover:border-gold-subtle hover:bg-gold/10 hover:text-black dark:text-white/75 dark:hover:text-white"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active
                          ? "text-gold-dark dark:text-gold-light"
                          : "text-black/65 group-hover:text-gold-dark dark:text-white/65 dark:group-hover:text-gold-light"
                      )}
                    />
                    <span className={cn(isCollapsed ? "hidden" : "inline")}>{item.label}</span>
                  </Link>
                )}

                {/* SubItems */}
                {hasSubItems && !isCollapsed && (
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <ul className="mt-1 flex flex-col gap-1 pb-1 pl-9 pr-2">
                          {item.subItems!.map((subItem) => {
                            const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href);
                            return (
                              <li key={subItem.href}>
                                <Link
                                  href={subItem.href}
                                  onClick={closeMobileSidebar}
                                  className={cn(
                                    "block w-full rounded-md px-2 py-1.5 text-sm transition-colors",
                                    isSubActive
                                      ? "text-gold-dark font-medium dark:text-gold-light"
                                      : "text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
                                  )}
                                >
                                  {subItem.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[#E5E5E5] p-3 dark:border-[#262626]">
        <div
          className={cn(
            "mb-3 flex items-center rounded-md border border-gold-subtle bg-gold/5 p-2.5",
            isCollapsed ? "justify-center" : "gap-2.5"
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
            isCollapsed ? "justify-center px-2" : "gap-2.5"
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

