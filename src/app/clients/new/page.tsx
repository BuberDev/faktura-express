import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { ClientForm } from "@/components/clients/client-form";

export const metadata = { title: "Nowy kontrahent | Faktura In" };

export default async function NewClientPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const profile = await new SupabaseProfileRepository().getById(user.id).catch(() => null);

  return (
    <AppShell
      title="Nowy kontrahent"
      subtitle="Uzupełnij dane kontrahenta."
      userEmail={user.email}
      avatarUrl={profile?.avatarUrl}
      maxWidth="max-w-[800px]"
    >
      <ClientForm mode="create" />
    </AppShell>
  );
}
