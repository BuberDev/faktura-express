import { notFound, redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { formatPlnCurrency } from "@/core/use-cases/format-currency";
import { SupabaseInvoiceRepository } from "@/infrastructure/supabase/queries/invoice-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

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

  const repository = new SupabaseInvoiceRepository(supabase);
  const invoice = await repository.getByIdForUser(id, user.id);

  if (!invoice) {
    notFound();
  }

  return (
    <AppShell
      title={`Faktura ${invoice.number}`}
      subtitle="Szczegóły dokumentu i pozycje sprzedaży."
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

        <div className="ml-auto w-full max-w-xs space-y-2 rounded-md border border-gold-subtle bg-gold/10 p-3">
          <div className="flex items-center justify-between">
            <span>Netto</span>
            <span>{formatPlnCurrency(invoice.totalNet)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>VAT</span>
            <span>{formatPlnCurrency(invoice.totalVat)}</span>
          </div>
          <div className="flex items-center justify-between font-semibold text-gold-dark dark:text-gold-light">
            <span>Brutto</span>
            <span>{formatPlnCurrency(invoice.totalGross)}</span>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
