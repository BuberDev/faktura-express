import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Plus } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPlnCurrency } from "@/core/use-cases/format-currency";
import { SupabaseProductRepository } from "@/infrastructure/supabase/queries/product-repository";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { ProductsTable } from "@/components/products/products-table";

export const metadata = { title: "Usługi i Towary | Faktura In" };

export default async function ProductsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [productsList, profile] = await Promise.all([
    new SupabaseProductRepository().listByUser(user.id).catch(() => []),
    new SupabaseProfileRepository().getById(user.id).catch(() => null),
  ]);

  return (
    <AppShell
      title="Usługi i Towary"
      subtitle="Katalog Twoich usług i towarów — dodawaj je do faktur jednym kliknięciem."
      userEmail={user.email}
      avatarUrl={profile?.avatarUrl}
      maxWidth="max-w-[1400px]"
    >
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl">Katalog produktów</h2>
            <p className="text-sm text-black/60 dark:text-white/60 mt-1">
              {productsList.length} pozycji w katalogu
            </p>
          </div>
          <Link href="/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nowy produkt
            </Button>
          </Link>
        </div>

        {productsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 mb-4">
              <Package className="h-8 w-8 text-gold-dark dark:text-gold-light" />
            </div>
            <h3 className="font-display text-xl mb-2">Brak produktów</h3>
            <p className="text-black/60 dark:text-white/60 max-w-sm mb-6">
              Dodaj usługi i towary, które sprzedajesz, aby szybciej wystawiać faktury.
            </p>
            <Link href="/products/new">
              <Button>Dodaj produkt</Button>
            </Link>
          </div>
        ) : (
          <ProductsTable products={productsList} />
        )}
      </Card>
    </AppShell>
  );
}
