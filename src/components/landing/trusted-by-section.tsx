"use client";

import { motion } from "framer-motion";
import { Building2, FileText, ShieldCheck, Users } from "lucide-react";

const stats = [
  { id: 1, name: "Wystawionych bezpłatnie", value: "Nielimitowane", icon: FileText },
  { id: 2, name: "Pobieranie z GUS", value: "Tak, po NIP", icon: Building2 },
  { id: 3, name: "Ochrona i Bezpieczeństwo", value: "Pełne", icon: ShieldCheck },
  { id: 4, name: "Koszt subskrypcji", value: "0 zł na zawsze", icon: Users },
];

export function TrustedBySection() {
  return (
    <div className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold leading-8 tracking-widest text-gold-dark dark:text-gold-light uppercase">
            Prawdziwa darmowa platforma
          </h2>
          <p className="mt-2 text-3xl font-display tracking-tight text-black dark:text-white sm:text-4xl">
            Stworzona do pracy. Nie do abonamentów.
          </p>
          <p className="mt-6 text-lg leading-8 text-black/70 dark:text-white/70">
            Dostarczamy pełną, bezkompromisową jakość Premium bez żadnych ukrytych kosztów. Twoje dane i Twoje dokumenty są u nas całkowicie bezpieczne.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 dark:bg-black/40 p-8 shadow-gold-md backdrop-blur-md"
              >
                <dt className="flex flex-col items-center gap-y-4 text-sm font-medium leading-6 text-black/60 dark:text-white/60">
                  <div className="rounded-full bg-gold/10 p-3 ring-1 ring-gold/20">
                    <stat.icon className="h-6 w-6 text-gold" aria-hidden="true" />
                  </div>
                  {stat.name}
                </dt>
                <dd className="mt-4 font-display text-3xl tracking-tight text-white">
                  {stat.value}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
