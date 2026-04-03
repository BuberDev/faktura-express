"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#porownanie", label: "Porównanie" },
  { href: "/invoices/new", label: "Nowa faktura" },
  { href: "/auth/login", label: "Logowanie" },
];

export function LandingNavbar() {
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
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6"
    >
      <div
        className={`mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between rounded-2xl border px-4 transition-all duration-300 md:px-6 ${
          isScrolled
            ? "border-gold-subtle bg-white/78 shadow-gold-md backdrop-blur-xl dark:bg-black/72"
            : "border-gold-subtle/45 bg-white/35 backdrop-blur-md dark:bg-black/35"
        }`}
      >
        <Link href="/" className="group inline-flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Faktura Express"
            width={36}
            height={36}
            priority
            className="h-9 w-9 rounded-full object-cover shadow-gold-sm"
          />
          <span className="font-display text-2xl tracking-wide transition-colors group-hover:text-gold-dark dark:group-hover:text-gold-light">
            Faktura Express
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-black/78 transition hover:text-gold-dark dark:text-white/78 dark:hover:text-gold-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="hidden sm:block ">
            <Button variant="outline" className="cursor-pointer">Zaloguj się</Button>
          </Link>
          <Link href="/invoices/new">
            <Button className="bg-gold-metallic cursor-pointer">Wystaw Fakturę</Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
