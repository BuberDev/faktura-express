"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const demoNip = "5252739428";

export function HeroAnimation() {
  const [typedNip, setTypedNip] = useState("");
  const [grossValue, setGrossValue] = useState(0);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    let nipIndex = 0;

    const nipTimer = setInterval(() => {
      nipIndex += 1;
      setTypedNip(demoNip.slice(0, nipIndex));

      if (nipIndex >= demoNip.length) {
        clearInterval(nipTimer);
      }
    }, 110);

    return () => clearInterval(nipTimer);
  }, []);

  useEffect(() => {
    const targetValue = 12345.67;
    const amountTimer = setInterval(() => {
      setGrossValue((current) => {
        const nextValue = current + 321.45;

        if (nextValue >= targetValue) {
          clearInterval(amountTimer);
          setIsApproved(true);
          return targetValue;
        }

        return Number(nextValue.toFixed(2));
      });
    }, 32);

    return () => clearInterval(amountTimer);
  }, []);

  const formattedGross = useMemo(() => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(grossValue);
  }, [grossValue]);

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-14 pt-8 md:grid-cols-2 md:px-8">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-md border border-white/10 bg-white/5 p-6 backdrop-blur-md"
      >
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/50">
          Stan początkowy
        </p>
        <h3 className="mb-5 font-display text-2xl">Pusta faktura</h3>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`skeleton-row-${index}`}
              className="h-10 rounded-md border border-dashed border-[#E5E5E5] dark:border-[#262626]"
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="rounded-md border border-gold-subtle bg-white/5 p-6 shadow-gold-lg backdrop-blur-md"
      >
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gold-dark dark:text-gold-light">
          Stan po 33 sekundyach
        </p>
        <h3 className="mb-5 font-display text-2xl">Gotowa faktura</h3>

        <div className="space-y-3 text-sm">
          <div className="rounded-md border border-gold-subtle bg-gold/10 p-3">
            <p className="text-xs text-white/50">NIP nabywcy</p>
            <p className="font-semibold tracking-[0.15em]">{typedNip || "_"}</p>
          </div>

          <div className="rounded-md border border-white/10 bg-white/5 p-3">
            <p className="text-xs text-white/50">Kwota brutto</p>
            <motion.p
              key={formattedGross}
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="font-display text-2xl text-gold-dark dark:text-gold-light"
            >
              {formattedGross}
            </motion.p>
          </div>

          <div className="flex items-center gap-3 rounded-md border border-gold-subtle bg-black/40 p-3 text-white backdrop-blur-sm">
            <motion.span
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: isApproved ? 1 : 0.7, opacity: isApproved ? 1 : 0 }}
              transition={{ duration: 0.25 }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold text-black"
            >
              ✓
            </motion.span>
            <span>Wystawienie faktury zajęło mniej niż 33 sekundy.</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
