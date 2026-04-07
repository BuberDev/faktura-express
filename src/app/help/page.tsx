import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { HelpCircle, MessageCircle, BookOpen, ExternalLink } from "lucide-react";

export const metadata = { title: "Centrum pomocy | Faktura In" };

export default async function HelpPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const profile = await new SupabaseProfileRepository().getById(user.id).catch(() => null);

  const topics = [
    { icon: BookOpen, title: "Jak wystawić fakturę VAT?", desc: "Krok po kroku: dane, pozycje, PDF i wysyłka do KSeF." },
    { icon: BookOpen, title: "Jak dodać kontrahenta?", desc: "Zarządzanie bazą klientów i automatyczne uzupełnianie danych z GUS." },
    { icon: BookOpen, title: "Jak działa integracja z KSeF?", desc: "Wysyłanie faktur do Krajowego Systemu e-Faktur (FA/3)." },
    { icon: BookOpen, title: "Jak skonfigurować rachunek bankowy?", desc: "Ustawienia > Rachunki bankowe — domyślny IBAN na fakturach." },
    { icon: BookOpen, title: "Jak odczytać Rejestr VAT?", desc: "Księgowość > Rejestr VAT sprzedaży i zakupów — zestawienia miesięczne." },
    { icon: BookOpen, title: "Jak rejestrować koszty?", desc: "Koszty > Faktury kosztowe — ewidencja wydatków firmowych." },
  ];

  return (
    <AppShell title="Centrum pomocy" subtitle="Znajdź odpowiedzi na swoje pytania." userEmail={user.email} avatarUrl={profile?.avatarUrl} maxWidth="max-w-[1000px]">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {topics.map((t) => (
            <Card key={t.title} className="flex gap-4 p-4 hover:shadow-gold-sm transition-shadow cursor-pointer group">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 group-hover:bg-gold/20 transition-colors">
                <t.icon className="h-5 w-5 text-gold-dark dark:text-gold-light" />
              </div>
              <div>
                <h3 className="font-medium text-sm">{t.title}</h3>
                <p className="text-xs text-black/60 dark:text-white/60 mt-0.5">{t.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="flex flex-col sm:flex-row items-center gap-6 p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold/10">
            <MessageCircle className="h-7 w-7 text-gold-dark dark:text-gold-light" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-display text-lg">Nie znalazłeś odpowiedzi?</h3>
            <p className="text-sm text-black/60 dark:text-white/60 mt-1">Napisz do nas — odpowiadamy w ciągu 24 godzin w dni robocze.</p>
          </div>
          <a
            href="mailto:pomoc@faktura.in"
            className="ml-auto flex shrink-0 items-center gap-2 rounded-md bg-gold-metallic px-4 py-2 text-sm font-semibold text-black shadow-gold-sm hover:shadow-gold-md transition-shadow"
          >
            <ExternalLink className="h-4 w-4" />
            Napisz do nas
          </a>
        </Card>
      </div>
    </AppShell>
  );
}
