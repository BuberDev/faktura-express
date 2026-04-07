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
export const metadata = { title: "Zamówienia u dostawców | Faktura In" };
export default async function CostOrdersPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const [costsList, profile] = await Promise.all([
    new SupabaseCostRepository().listByUserAndType(user.id, "order").catch(() => []),
    new SupabaseProfileRepository().getById(user.id).catch(() => null),
  ]);
  return (
    <AppShell title="Zamówienia u dostawców" subtitle="Dokumenty zamówień składanych do dostawców." userEmail={user.email} avatarUrl={profile?.avatarUrl} maxWidth="max-w-[1400px]">
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Zamówienia ({costsList.length})</h2>
          <Link href="/costs/orders/new"><Button className="gap-2"><Plus className="h-4 w-4" />Dodaj zamówienie</Button></Link>
        </div>
        {costsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 mb-4"><ShoppingBasket className="h-8 w-8 text-gold-dark dark:text-gold-light" /></div>
            <h3 className="font-display text-xl mb-2">Brak zamówień</h3>
            <p className="text-black/60 dark:text-white/60 max-w-sm mb-6">Rejestruj zamówienia składane u swoich dostawców.</p>
            <Link href="/costs/orders/new"><Button>Dodaj zamówienie</Button></Link>
          </div>
        ) : <CostsTable costs={costsList} />}
      </Card>
    </AppShell>
  );
}
