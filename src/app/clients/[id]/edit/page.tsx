import { redirect, notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { SupabaseClientRepository } from "@/infrastructure/supabase/queries/client-repository";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { ClientForm } from "@/components/clients/client-form";

export const metadata = { title: "Edytuj kontrahenta | Faktura In" };

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [client, profile] = await Promise.all([
    new SupabaseClientRepository().getByIdForUser(params.id, user.id).catch(() => null),
    new SupabaseProfileRepository().getById(user.id).catch(() => null),
  ]);

  if (!client) notFound();

  return (
    <AppShell
      title="Edytuj kontrahenta"
      subtitle={client.name}
      userEmail={user.email}
      avatarUrl={profile?.avatarUrl}
      maxWidth="max-w-[800px]"
    >
      <ClientForm mode="edit" client={client} />
    </AppShell>
  );
}
