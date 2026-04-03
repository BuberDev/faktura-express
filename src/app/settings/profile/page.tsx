import { redirect } from "next/navigation";

import { AccountLinkingCard } from "@/components/auth/account-linking-card";
import { AppShell } from "@/components/layout/app-shell";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

export default async function ProfileSettingsPage() {
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
      title="Ustawienia profilu"
      subtitle="Dane konta właściciela i preferencje logowania."
      userEmail={user.email}
      avatarUrl={profile?.avatarUrl}
    >
      <ProfileSettingsForm />
      <div className="mt-4">
        <AccountLinkingCard />
      </div>
    </AppShell>
  );
}
