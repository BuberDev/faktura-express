"use client";

import { useRouter } from "next/navigation";

import Image from "next/image";
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
        line2: "33 sekundy",
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
      className="min-h-screen pb-20"
    >
      {/* 3D Perspective Image with Bottom Shadow Effect */}
      <div className="mx-auto w-full max-w-4xl [perspective:2000px] mt-4 md:mt-8 relative gap-8">
        
        <div 
          className="relative z-10 transition-all duration-700 ease-out hover:[transform:none] w-full"
          style={{ 
            transform: "rotateX(20deg) skewX(5deg)",
            WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)"
          }}
        >
          <Image
            src="/invoice-filled-state.svg"
            alt="Faktura In Preview"
            width={904}
            height={724}
            className="w-full h-auto rounded-2xl border border-white/5"
            priority
          />
        </div>
      </div>
    </AnimatedShaderHero>
  );
}
