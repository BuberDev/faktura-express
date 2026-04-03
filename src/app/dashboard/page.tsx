import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { SupabaseInvoiceRepository } from "@/infrastructure/supabase/queries/invoice-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const repository = new SupabaseInvoiceRepository(supabase);
  const invoices = await repository.listByUser(user.id).catch(() => []);

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
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wide text-black/55 dark:text-white/55">Faktury w toku</p>
          <p className="mt-2 font-display text-3xl">{pendingInvoices}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-black/55 dark:text-white/55">Opłacone w tym miesiącu</p>
          <p className="mt-2 font-display text-3xl">{paidThisMonth}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-black/55 dark:text-white/55">Konto</p>
          <p className="mt-2 text-sm text-black/70 dark:text-white/70">{user.email}</p>
        </Card>
      </div>
    </AppShell>
  );
}
