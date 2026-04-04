import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { SupabaseInvoiceRepository } from "@/infrastructure/supabase/queries/invoice-repository";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const repository = new SupabaseInvoiceRepository();
  const profileRepository = new SupabaseProfileRepository();
  
  const [invoices, profile] = await Promise.all([
    repository.listByUser(user.id).catch(() => []),
    profileRepository.getById(user.id).catch(() => null),
  ]);

  const pendingInvoices = invoices.filter((invoice) => invoice.status === "unpaid").length;
  const paidThisMonth = invoices.filter((invoice) => {
    if (invoice.status !== "paid") {
      return false;
    }

    const paidDate = new Date(invoice.issueDate);
    const now = new Date();

    return (
      paidDate.getFullYear() === now.getFullYear() &&
      paidDate.getMonth() === now.getMonth()
    );
  }).length;

  return (
    <AppShell
      title="Panel główny"
      subtitle="Najważniejsze informacje o fakturach i statusach płatności."
      userEmail={user.email}
      avatarUrl={profile?.avatarUrl}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-6 shadow-gold-md">
          <p className="text-xs uppercase tracking-wide text-white/55">Faktury w toku</p>
          <p className="mt-2 font-display text-3xl text-white">{pendingInvoices}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-6 shadow-gold-md">
          <p className="text-xs uppercase tracking-wide text-white/55">Opłacone w tym miesiącu</p>
          <p className="mt-2 font-display text-3xl text-white">{paidThisMonth}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-6 shadow-gold-md">
          <p className="text-xs uppercase tracking-wide text-white/55">Konto</p>
          <p className="mt-2 text-sm text-white/90">{user.email}</p>
        </div>
      </div>
    </AppShell>
  );
}
