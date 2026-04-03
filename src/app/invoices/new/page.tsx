import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { InvoiceWorkspace } from "@/components/invoice/invoice-workspace";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

export default async function NewInvoicePage() {
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
      title="Nowa faktura"
      subtitle="Formularz i podgląd PDF działają równolegle w czasie rzeczywistym."
      userEmail={user.email}
      avatarUrl={profile?.avatarUrl}
    >
      <InvoiceWorkspace />
    </AppShell>
  );
}
