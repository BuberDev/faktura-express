import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { SupabasePaymentMethodRepository } from "@/infrastructure/supabase/queries/payment-method-repository";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { PaymentMethodsManager } from "@/components/settings/payment-methods-manager";

export const metadata = { title: "Formy płatności | Faktura In" };

export default async function PaymentMethodsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [methods, profile] = await Promise.all([
    new SupabasePaymentMethodRepository().listByUser(user.id).catch(() => []),
    new SupabaseProfileRepository().getById(user.id).catch(() => null),
  ]);

  return (
    <AppShell title="Formy płatności" subtitle="Skonfiguruj dostępne formy płatności i domyślne terminy dla Twoich faktur." userEmail={user.email} avatarUrl={profile?.avatarUrl} maxWidth="max-w-[900px]">
      <PaymentMethodsManager methods={methods} />
    </AppShell>
  );
}
