"use client";

import { motion } from "framer-motion";
import { DownloadCloud, LayoutTemplate, Palette, Search } from "lucide-react";

const mainFeatures = [
  {
    name: "Autouzupełnianie z GUS",
    description: "Nie trać czasu na przepisywanie danych i literówki. Wpisz sam numer NIP firmy, a my natychmiast uzupełnimy nazwę i adres korzystając z oficjalnej państwowej bazy danych BIR1.1.",
    icon: Search,
    glow: "rgba(212, 175, 55, 0.2)",
  },
  {
    name: "Luksusowe Wzory Faktur",
    description: "Zapomnij o nudnych szablonach. Wyróżnij się w oczach swoich kontrahentów dzięki naszym wyjątkowym, designerskim wzorom (w tym unikalnemu układowi Luxury z akcentami złota).",
    icon: Palette,
    glow: "rgba(255, 255, 255, 0.15)",
  },
  {
    name: "Idealne formatowanie PDF",
    description: "Nasz zaawansowany silnik generowania w czasie rzeczywistym (@react-pdf/renderer) dba o to, by wektorowa jakość dokumentów była idealna niezależnie od tego, czy drukujesz, czy wysyłasz powiększony plik.",
    icon: DownloadCloud,
    glow: "rgba(212, 175, 55, 0.15)",
  },
  {
    name: "Nowoczesny Interfejs Szklany",
    description: "Większość aplikacji B2B straszy starymi, siermiężnymi interfejsami. Faktura In została zaprojektowana zgodnie z trendem Luxury Glassmorphism, zapewniając najwyższą ucztę dla oka.",
    icon: LayoutTemplate,
    glow: "rgba(255, 255, 255, 0.1)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export function FeaturesGridSection() {
  return (
    <div className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold leading-8 tracking-widest text-gold-dark dark:text-gold-light uppercase">
            Wyłącznie konkrety
          </h2>
          <p className="mt-2 text-3xl font-display tracking-tight text-white sm:text-4xl">
            Odcięliśmy wszystko, co zbędne.
            <br />
            <span className="text-gold-light">Zostawiliśmy to, co genialne.</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-white/70">
            Postawiliśmy na jakość i estetykę z najwyższej półki zamiast obiecywać nieistniejące funkcje.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {mainFeatures.map((feature, featureIdx) => (
              <motion.div
                key={feature.name}
                variants={itemVariants}
                className="relative flex flex-col gap-6 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-gold-md backdrop-blur-md transition-colors hover:bg-black/60 sm:p-10"
                style={{
                  boxShadow: `inset 0 0 20px ${feature.glow}`,
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold-subtle bg-gold/10">
                  <feature.icon className="h-6 w-6 text-gold" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-8 text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-white/65">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
