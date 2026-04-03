import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { InvoicePdfDownloadButton } from "@/components/invoice/invoice-pdf-download-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPlnCurrency } from "@/core/use-cases/format-currency";
import { SupabaseInvoiceRepository } from "@/infrastructure/supabase/queries/invoice-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { ChevronLeft } from "lucide-react";

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const repository = new SupabaseInvoiceRepository();
  const invoice = await repository.getByIdForUser(id, user.id);

  if (!invoice) {
    notFound();
  }

  return (
    <AppShell
      title={`Faktura ${invoice.number}`}
      subtitle="Szczegóły dokumentu i pozycje sprzedaży."
      userEmail={user.email}
    >
      <Card className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-black/50 dark:text-white/50">
              Data wystawienia
            </p>
            <p>{invoice.issueDate}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-black/50 dark:text-white/50">
              Status
            </p>
            <p>{invoice.status === "paid" ? "Opłacona" : "Nieopłacona"}</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border border-[#E5E5E5] dark:border-[#262626]">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/5 dark:bg-white/5">
              <tr>
                <th className="px-3 py-2">Opis</th>
                <th className="px-3 py-2">Ilość</th>
                <th className="px-3 py-2">VAT</th>
                <th className="px-3 py-2 text-right">Netto</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr
                  key={`${item.description}-${index}`}
                  className="border-t border-[#E5E5E5] dark:border-[#262626]"
                >
                  <td className="px-3 py-2">{item.description}</td>
                  <td className="px-3 py-2">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-3 py-2">{item.vatRate}%</td>
                  <td className="px-3 py-2 text-right">
                    {formatPlnCurrency(item.netPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#E5E5E5] pt-6 dark:border-[#262626] md:flex-row md:items-end md:justify-between">
          <Link href="/invoices">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Wróć do listy
            </Button>
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex w-full flex-col gap-2 rounded-md border border-gold-subtle bg-gold/5 p-4 md:min-w-[300px]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-black/60 dark:text-white/60">Netto</span>
                <span>{formatPlnCurrency(invoice.totalNet)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-black/60 dark:text-white/60">VAT</span>
                <span>{formatPlnCurrency(invoice.totalVat)}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-gold-dark dark:text-gold-light">
                <span>Brutto</span>
                <span>{formatPlnCurrency(invoice.totalGross)}</span>
              </div>
            </div>

            <InvoicePdfDownloadButton invoice={invoice} variant="gold" className="md:w-auto" />
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
