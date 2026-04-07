import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SupabaseInvoiceRepository } from "@/infrastructure/supabase/queries/invoice-repository";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { InvoicePdfDownloadButton } from "@/components/invoice/invoice-pdf-download-button";
import { formatPlnCurrency } from "@/core/use-cases/format-currency";

export const metadata = { title: "Oferty | Faktura In" };

export default async function InvoicesOffersPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const [invoices, profile] = await Promise.all([
    new SupabaseInvoiceRepository().listByUser(user.id).catch(() => []),
    new SupabaseProfileRepository().getById(user.id).catch(() => null),
  ]);
  const offers = invoices.filter((i) => i.type === "Offer");
  return (
    <AppShell title="Oferty" subtitle="Oferty handlowe dla Twoich klientów." userEmail={user.email} avatarUrl={profile?.avatarUrl} maxWidth="max-w-[1600px]">
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Oferty ({offers.length})</h2>
          <Link href="/invoices/new"><Button className="gap-2"><Plus className="h-4 w-4" />Nowa oferta</Button></Link>
        </div>
        {offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 mb-4"><FileText className="h-8 w-8 text-gold-dark dark:text-gold-light" /></div>
            <h3 className="font-display text-xl mb-2">Brak ofert</h3>
            <p className="text-black/60 dark:text-white/60 max-w-sm">Tutaj pojawią się oferty handlowe, które wyślesz klientom.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border border-[#E5E5E5] dark:border-[#262626]">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/5 text-xs font-semibold uppercase tracking-wider dark:bg-white/5">
                <tr><th className="px-4 py-3">Numer</th><th className="px-4 py-3">Data</th><th className="px-4 py-3">Klient</th><th className="px-4 py-3">Kwota</th><th className="px-4 py-3 text-right">Akcje</th></tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#262626]">
                {offers.map((inv) => (
                  <tr key={inv.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="px-4 py-4 font-medium">{inv.number}</td>
                    <td className="px-4 py-4 text-black/60 dark:text-white/60">{inv.issueDate}</td>
                    <td className="px-4 py-4">{inv.client.name}</td>
                    <td className="px-4 py-4 font-semibold">{formatPlnCurrency(inv.totalGross)}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <InvoicePdfDownloadButton invoice={inv} variant="outline" className="h-8 w-auto px-3" />
                        <Link href={`/invoices/${inv.id}`}><Button variant="outline" size="sm" className="h-8">Otwórz</Button></Link>
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
