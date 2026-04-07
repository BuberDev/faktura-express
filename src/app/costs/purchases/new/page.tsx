import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { CostForm } from "@/components/costs/cost-form";
export const metadata = { title: "Nowa faktura zakupu | Faktura In" };
export default async function NewCostPurchasePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const profile = await new SupabaseProfileRepository().getById(user.id).catch(() => null);
  return (
    <AppShell title="Nowa faktura zakupu" userEmail={user.email} avatarUrl={profile?.avatarUrl} maxWidth="max-w-[900px]">
      <CostForm type="purchase" backHref="/costs/purchases" typeLabel="Faktura zakupu" />
    </AppShell>
  );
}
