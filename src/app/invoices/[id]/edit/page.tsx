import { notFound, redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { InvoiceWorkspace } from "@/components/invoice/invoice-workspace";
import { SupabaseInvoiceRepository } from "@/infrastructure/supabase/queries/invoice-repository";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

interface EditInvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const repository = new SupabaseInvoiceRepository();
  const profileRepository = new SupabaseProfileRepository();

  const [invoice, profile] = await Promise.all([
    repository.getByIdForUser(id, user.id),
    profileRepository.getById(user.id).catch(() => null),
  ]);

  if (!invoice) {
    notFound();
  }

  // Security check: Don't allow editing if already in KSeF
  if (invoice.ksefStatus && invoice.ksefStatus !== "none" && invoice.ksefStatus !== "rejected") {
     redirect(`/invoices/${id}?error=ksef_immutable`);
  }

  return (
    <AppShell
      title={`Edytuj Fakturę ${invoice.number}`}
      subtitle="Zmień dane dokumentu przed zapisaniem."
      userEmail={user.email}
      avatarUrl={profile?.avatarUrl}
    >
      <InvoiceWorkspace initialData={invoice} />
    </AppShell>
  );
}
