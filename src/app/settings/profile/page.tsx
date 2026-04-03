import { redirect } from "next/navigation";

import { AccountLinkingCard } from "@/components/auth/account-linking-card";
import { AppShell } from "@/components/layout/app-shell";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

export default async function ProfileSettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <AppShell
      title="Ustawienia profilu"
      subtitle="Dane konta właściciela i preferencje logowania."
      userEmail={user.email}
    >
      <ProfileSettingsForm />
      <div className="mt-4">
        <AccountLinkingCard />
      </div>
    </AppShell>
  );
}
