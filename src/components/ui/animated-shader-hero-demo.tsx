"use client";

import { useRouter } from "next/navigation";

import AnimatedShaderHero from "@/components/ui/animated-shader-hero";

export default function AnimatedShaderHeroDemo() {
  const router = useRouter();

  return (
    <div className="w-full">
      <AnimatedShaderHero
        trustBadge={{
          text: "Zaufane przez przedsiębiorców B2B.",
          icons: ["✦"],
        }}
        headline={{
          line1: "Wystawiaj",
          line2: "Faktury Premium",
        }}
        subtitle="Szybkie, bezpieczne i profesjonalne fakturowanie w standardzie black, white & gold."
        buttons={{
          primary: {
            text: "Wystaw Fakturę",
            onClick: () => router.push("/invoices/new"),
          },
          secondary: {
            text: "Zaloguj się",
            onClick: () => router.push("/auth/login"),
          },
        }}
      />
    </div>
  );
}
