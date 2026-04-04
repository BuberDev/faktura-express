"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#porownanie", label: "Porównanie" },
  { href: "/invoices/new", label: "Nowa faktura" },
  { href: "/auth/login", label: "Logowanie" },
];

export function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6"
      >
        <div
          className={`mx-auto flex h-[64px] md:h-[72px] w-full max-w-7xl items-center justify-between rounded-xl md:rounded-2xl border px-3 md:px-6 transition-all duration-300 ${isScrolled
              ? "border-gold-subtle bg-white/78 shadow-gold-md backdrop-blur-xl dark:bg-black/72"
              : "border-gold-subtle/45 bg-white/35 backdrop-blur-md dark:bg-black/35"
            }`}
        >
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gold-subtle/30 bg-black/20 text-white md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <Link href="/" className="group inline-flex items-center gap-2 md:gap-3">
              <Image
                src="/logo.png"
                alt="Faktura In"
                width={32}
                height={32}
                priority
                className="h-7 w-7 md:h-9 md:w-9 rounded-full object-cover shadow-gold-sm"
              />
              <span className="font-display text-lg md:text-2xl tracking-wide transition-colors group-hover:text-gold-dark dark:group-hover:text-gold-light">
                Faktura In
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-white/80 transition hover:text-gold-light"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/auth/login" className="hidden sm:block">
              <Button variant="outline" size="sm" className="cursor-pointer h-8 md:h-10">Zaloguj się</Button>
            </Link>
            <Link href="/invoices/new">
              <Button size="sm" className="bg-gold-metallic cursor-pointer h-8 md:h-10 px-3 md:px-4 text-xs md:text-sm">Wystaw Fakturę</Button>
            </Link>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-[70] w-full max-w-[300px] border-r border-gold-subtle/20 bg-black p-6 shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-display text-2xl text-white">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white/70 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-white/90 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 pt-6 border-t border-white/10 flex flex-col gap-4">
                  <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Zaloguj się</Button>
                  </Link>
                  <Link href="/invoices/new" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="bg-gold-metallic w-full">Wystaw Fakturę</Button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
