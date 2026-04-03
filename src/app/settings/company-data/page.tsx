import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { CompanySettingsForm } from "@/components/settings/company-settings-form";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

export default async function CompanyDataSettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profileRepository = new SupabaseProfileRepository();
  const profile = await profileRepository.getById(user.id).catch(() => null);

  return (
    <AppShell
      title="Dane firmy"
      subtitle="Informacje domyślnie wstawiane na każdą fakturę."
      userEmail={user.email}
      avatarUrl={profile?.avatarUrl}
    >
      <CompanySettingsForm />
    </AppShell>
  );
}
