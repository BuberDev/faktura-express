import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { LandingHeroSection } from "@/components/landing/landing-hero-section";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { InvoiceCompareSection } from "@/components/landing/invoice-compare-section";
import { SilkBackground } from "@/components/ui/silk-background-animation";
import { Badge } from "@/components/ui/badge";
import Footer4Col from "@/components/ui/footer-column";

interface HomePageProps {
  searchParams: Promise<{
    code?: string;
    error?: string;
    error_description?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  // Fallback for providers that return to Site URL with `?code=...`.
  if (params.code) {
    redirect(`/auth/callback?code=${encodeURIComponent(params.code)}&next=/dashboard`);
  }

  if (params.error) {
    const loginError = params.error_description || params.error;
    redirect(`/auth/login?error=${encodeURIComponent(loginError)}`);
  }

  return (
    <div className="dark relative min-h-screen bg-transparent text-white">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <SilkBackground />
      </div>
      <LandingNavbar />

      <main>
        <LandingHeroSection />
        <InvoiceCompareSection />

        <section className="mx-auto w-full max-w-7xl px-4 pb-10 pt-16 md:px-8">
          <div className="space-y-3 rounded-md border border-gold-subtle bg-white/5 p-6 shadow-gold-lg dark:bg-black/20 backdrop-blur-md">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark dark:text-gold-light">
              Dlaczego Faktura In
            </h2>
            {[
              "Szybkie wystawianie i gotowy PDF",
              "Automatyczne wyliczenia i podgląd na żywo",
              "Spójny, elegancki wygląd dokumentów",
              "Bezpieczne logowanie Google i e-mail",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-md border border-white/10 p-3 bg-white/5">
                <CheckCircle2 className="h-4 w-4 text-gold" />
                <p className="text-sm text-white/90">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer4Col />
    </div>
  );
}
