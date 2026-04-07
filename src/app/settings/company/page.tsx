import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { CompanyDataForm } from "@/components/settings/company-data-form";

export const metadata = { title: "Dane firmy | Faktura In" };

export default async function CompanySettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const profile = await new SupabaseProfileRepository().getById(user.id).catch(() => null);

  return (
    <AppShell title="Dane firmy" subtitle="Dane Twojej działalności, które pojawią się na wystawianych fakturach." userEmail={user.email} avatarUrl={profile?.avatarUrl} maxWidth="max-w-[800px]">
      <CompanyDataForm profile={profile} />
    </AppShell>
  );
}
