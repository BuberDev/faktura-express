import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Plus } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SupabaseClientRepository } from "@/infrastructure/supabase/queries/client-repository";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { ClientsTable } from "@/components/clients/clients-table";

export const metadata = { title: "Kontrahenci | Faktura In" };

export default async function ClientsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [clients, profile] = await Promise.all([
    new SupabaseClientRepository().listByUser(user.id).catch(() => []),
    new SupabaseProfileRepository().getById(user.id).catch(() => null),
  ]);

  return (
    <AppShell
      title="Kontrahenci"
      subtitle="Zarządzaj bazą klientów i dostawców."
      userEmail={user.email}
      avatarUrl={profile?.avatarUrl}
      maxWidth="max-w-[1400px]"
    >
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl">Baza kontrahentów</h2>
            <p className="text-sm text-black/60 dark:text-white/60 mt-1">
              {clients.length} {clients.length === 1 ? "kontrahent" : clients.length < 5 ? "kontrahentów" : "kontrahentów"}
            </p>
          </div>
          <Link href="/clients/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nowy kontrahent
            </Button>
          </Link>
        </div>

        {clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 mb-4">
              <Users className="h-8 w-8 text-gold-dark dark:text-gold-light" />
            </div>
            <h3 className="font-display text-xl mb-2">Brak kontrahentów</h3>
            <p className="text-black/60 dark:text-white/60 max-w-sm mb-6">
              Dodaj pierwszego kontrahenta, aby przyspieszyć wystawianie faktur.
            </p>
            <Link href="/clients/new">
              <Button>Dodaj kontrahenta</Button>
            </Link>
          </div>
        ) : (
          <ClientsTable clients={clients} />
        )}
      </Card>
    </AppShell>
  );
}
