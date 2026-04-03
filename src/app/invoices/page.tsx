import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPlnCurrency } from "@/core/use-cases/format-currency";
import { SupabaseInvoiceRepository } from "@/infrastructure/supabase/queries/invoice-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { InvoicePdfDownloadButton } from "@/components/invoice/invoice-pdf-download-button";
import { cn } from "@/lib/utils";

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
    <AppShell title="Faktury" subtitle="Lista dokumentów przypisana do Twojego konta." userEmail={user.email}>
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
                  <thead className="bg-black/5 text-xs font-semibold uppercase tracking-wider dark:bg-white/5">
                    <tr>
                      <th className="px-4 py-3">Numer</th>
                      <th className="px-4 py-3">Data</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Brutto</th>
                      <th className="px-4 py-3 text-right">Akcje</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#262626]">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                        <td className="px-4 py-4 font-medium">{invoice.number}</td>
                        <td className="px-4 py-4 text-black/60 dark:text-white/60">{invoice.issueDate}</td>
                        <td className="px-4 py-4">
                          <span className={cn(
                            "rounded-full px-2 py-1 text-[10px] font-bold uppercase",
                            invoice.status === "paid" 
                              ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                              : "bg-gold/10 text-gold-dark dark:text-gold-light"
                          )}>
                            {invoice.status === "paid" ? "Opłacona" : "Nieopłacona"}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-semibold">{formatPlnCurrency(invoice.totalGross)}</td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <InvoicePdfDownloadButton invoice={invoice} variant="outline" className="h-8 w-auto px-3" />
                            <Link href={`/invoices/${invoice.id}`}>
                              <Button variant="outline" size="sm" className="h-8">
                                Otwórz
                              </Button>
                            </Link>
                          </div>
                        </td>
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
