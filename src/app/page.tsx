import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { HeroAnimation } from "@/components/landing/hero-animation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
    <div className="relative min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_8%,rgba(212,175,55,0.12),transparent_36%),radial-gradient(circle_at_85%_0%,rgba(212,175,55,0.09),transparent_28%)]" />

      <header className="sticky top-0 z-30 border-b border-gold-subtle bg-white/95 backdrop-blur dark:bg-black/95">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gold-metallic shadow-gold-sm" />
            <span className="font-display text-2xl tracking-wide">Faktura Express</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="outline">Zaloguj się</Button>
            </Link>
            <Link href="/invoices/new">
              <Button className="bg-gold-metallic">Wystaw Fakturę</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-7xl px-4 pb-10 pt-16 md:px-8 md:pt-24">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Badge className="mb-4 uppercase tracking-[0.2em]">
                Profesjonalne fakturowanie B2B
              </Badge>
              <h1 className="max-w-4xl font-display text-5xl leading-tight md:text-7xl">
                Jeden standard dla każdej faktury, każdej firmy i każdego klienta.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-black/72 dark:text-white/72">
                Wystawiasz dokumenty szybciej, eliminujesz błędy i utrzymujesz porządek finansowy bez kompromisów.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/invoices/new">
                  <Button className="bg-gold-metallic px-8 py-6 text-base">
                    Wystaw pierwszą fakturę
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" className="px-8 py-6 text-base">
                    Przejdź do logowania
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-3 rounded-md border border-gold-subtle bg-gradient-to-b from-white via-[#FCF6BA]/20 to-[#F9F9F9] p-6 shadow-gold-lg dark:bg-dark-surface">
              {[
                "Szybkie wystawianie i gotowy PDF",
                "Automatyczne wyliczenia i podgląd na żywo",
                "Spójny, elegancki wygląd dokumentów",
                "Bezpieczne logowanie Google i e-mail",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md border border-[#E5E5E5] p-3 dark:border-[#262626]">
                  <CheckCircle2 className="h-4 w-4 text-gold" />
                  <p className="text-sm text-black/80 dark:text-white/80">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HeroAnimation />
      </main>

      <footer className="border-t border-gold-subtle bg-gradient-to-b from-white to-[#F9F9F9] dark:bg-dark-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
          <p className="font-display text-2xl">Faktura Express</p>
          <p className="mt-2 max-w-2xl text-sm text-black/70 dark:text-white/70">
            Narzędzie do szybkiego i profesjonalnego fakturowania dla polskich przedsiębiorców B2B.
          </p>
          <Separator className="my-6" />
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-black/55 dark:text-white/55">
            <p>© {new Date().getFullYear()} Faktura Express.</p>
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="hover:text-gold-dark">
                Logowanie
              </Link>
              <Link href="/invoices/new" className="hover:text-gold-dark">
                Nowa faktura
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
