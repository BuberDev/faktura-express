import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { LandingHeroSection } from "@/components/landing/landing-hero-section";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { InvoiceCompareSection } from "@/components/landing/invoice-compare-section";
import { SilkBackground } from "@/components/ui/silk-background-animation";
import { FeaturesGridSection } from "@/components/landing/features-grid-section";
import { TrustedBySection } from "@/components/landing/trusted-by-section";
import { AnimatedTestimonialsSection } from "@/components/landing/testimonials-columns";
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

        <TrustedBySection />
        <FeaturesGridSection />
        <AnimatedTestimonialsSection />
      </main>

      <Footer4Col />
    </div>
  );
}
