import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBasket, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SupabaseCostRepository } from "@/infrastructure/supabase/queries/cost-repository";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { CostsTable } from "@/components/costs/costs-table";
export const metadata = { title: "Faktury z KSeF | Faktura In" };
export default async function CostKsefPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const [costsList, profile] = await Promise.all([
    new SupabaseCostRepository().listByUserAndType(user.id, "ksef").catch(() => []),
    new SupabaseProfileRepository().getById(user.id).catch(() => null),
  ]);
  return (
    <AppShell title="Faktury z KSeF" subtitle="Faktury kosztowe pobrane z Krajowego Systemu e-Faktur." userEmail={user.email} avatarUrl={profile?.avatarUrl} maxWidth="max-w-[1400px]">
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Faktury z KSeF ({costsList.length})</h2>
          <Link href="/costs/ksef/new"><Button className="gap-2"><Plus className="h-4 w-4" />Dodaj z KSeF</Button></Link>
        </div>
        {costsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 mb-4"><ShoppingBasket className="h-8 w-8 text-gold-dark dark:text-gold-light" /></div>
            <h3 className="font-display text-xl mb-2">Brak faktur z KSeF</h3>
            <p className="text-black/60 dark:text-white/60 max-w-sm mb-6">Tu będą pojawiały się faktury kosztowe pobrane z systemu KSeF.</p>
            <Link href="/costs/ksef/new"><Button>Zarejestruj fakturę KSeF</Button></Link>
          </div>
        ) : <CostsTable costs={costsList} />}
      </Card>
    </AppShell>
  );
}
