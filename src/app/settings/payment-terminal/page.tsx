import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { CreditCard, HelpCircle } from "lucide-react";

export const metadata = { title: "Terminal płatniczy | Faktura In" };

export default async function PaymentTerminalPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const profile = await new SupabaseProfileRepository().getById(user.id).catch(() => null);
  return (
    <AppShell title="Terminal płatniczy" subtitle="Integracja z terminalem kart płatniczych." userEmail={user.email} avatarUrl={profile?.avatarUrl} maxWidth="max-w-[900px]">
      <Card className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10">
            <CreditCard className="h-6 w-6 text-gold-dark dark:text-gold-light" />
          </div>
          <div>
            <h2 className="font-display text-xl">Integracja z terminalem płatniczym</h2>
            <p className="text-sm text-black/60 dark:text-white/60 mt-1">
              Zautomatyzuj przyjmowanie płatności kartą i BLIK bezpośrednio z poziomu wystawiania faktury.
            </p>
          </div>
        </div>
        <div className="rounded-md border border-gold-subtle bg-gold/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-4 w-4 text-gold-dark" />
            <span className="text-sm font-medium">Planowane integracje</span>
          </div>
          <ul className="text-sm text-black/60 dark:text-white/60 space-y-1 ml-6">
            <li>Stripe Terminal (karta i NFC)</li>
            <li>PayTel mPOS</li>
            <li>eService Lane 3000</li>
            <li>Verifone i Ingenico (przez API)</li>
          </ul>
        </div>
        <p className="text-sm text-black/50 dark:text-white/50 italic">
          Integracja z terminalami płatniczymi jest planowana w kolejnej wersji systemu.
        </p>
      </Card>
    </AppShell>
  );
}
