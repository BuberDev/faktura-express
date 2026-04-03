"use client";

import { useRouter } from "next/navigation";

import AnimatedShaderHero from "@/components/ui/animated-shader-hero";

export function LandingHeroSection() {
  const router = useRouter();

  return (
    <AnimatedShaderHero
      trustBadge={{
        text: "Zaufane narzędzie dla nowoczesnych firm B2B.",
        icons: ["✦"],
      }}
      headline={{
        line1: "Faktura w",
        line2: "10 sekund",
      }}
      subtitle="Wystawiaj dokumenty szybciej, zachowaj pełną kontrolę i wysyłaj profesjonalne faktury bez kompromisów bezpieczeństwa."
      buttons={{
        primary: {
          text: "Wystaw Fakturę",
          onClick: () => router.push("/invoices/new"),
        },
        secondary: {
          text: "Przejdź do logowania",
          onClick: () => router.push("/auth/login"),
        },
      }}
      className="h-screen"
    />
  );
}
