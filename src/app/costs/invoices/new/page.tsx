import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { CostForm } from "@/components/costs/cost-form";

export const metadata = { title: "Nowa faktura kosztowa | Faktura In" };

export default async function NewCostInvoicePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const profile = await new SupabaseProfileRepository().getById(user.id).catch(() => null);
  return (
    <AppShell title="Nowa faktura kosztowa" userEmail={user.email} avatarUrl={profile?.avatarUrl} maxWidth="max-w-[900px]">
      <CostForm type="invoice" backHref="/costs/invoices" typeLabel="Faktura kosztowa" />
    </AppShell>
  );
}
