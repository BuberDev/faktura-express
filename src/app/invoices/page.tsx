import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPlnCurrency } from "@/core/use-cases/format-currency";
import { SupabaseInvoiceRepository } from "@/infrastructure/supabase/queries/invoice-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

export default async function InvoicesPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const repository = new SupabaseInvoiceRepository(supabase);
  const invoices = await repository.listByUser(user.id).catch(() => []);

  return (
    <AppShell title="Faktury" subtitle="Lista dokumentów przypisana do Twojego konta.">
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Twoje faktury</h2>
          <Link href="/invoices/new">
            <Button>Wystaw Fakturę</Button>
          </Link>
        </div>

        {invoices.length === 0 ? (
          <p className="text-sm text-black/60 dark:text-white/60">
            Nie masz jeszcze żadnych faktur. Kliknij „Wystaw Fakturę”, aby dodać pierwszą.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-[#E5E5E5] dark:border-[#262626]">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/5 dark:bg-white/5">
                <tr>
                  <th className="px-3 py-2">Numer</th>
                  <th className="px-3 py-2">Data wystawienia</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Brutto</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t border-[#E5E5E5] dark:border-[#262626]">
                    <td className="px-3 py-2">
                      <Link href={`/invoices/${invoice.id}`} className="text-gold-dark hover:underline">
                        {invoice.number}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{invoice.issueDate}</td>
                    <td className="px-3 py-2">{invoice.status === "paid" ? "Opłacona" : "Nieopłacona"}</td>
                    <td className="px-3 py-2 text-right">{formatPlnCurrency(invoice.totalGross)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AppShell>
  );
}
