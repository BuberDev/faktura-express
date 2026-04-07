import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { SupabaseInvoiceRepository } from "@/infrastructure/supabase/queries/invoice-repository";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { formatPlnCurrency } from "@/core/use-cases/format-currency";

export const metadata = { title: "Rejestr VAT sprzedaży | Faktura In" };

export default async function VatSalesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [invoices, profile] = await Promise.all([
    new SupabaseInvoiceRepository().listByUser(user.id).catch(() => []),
    new SupabaseProfileRepository().getById(user.id).catch(() => null),
  ]);

  // Only non-draft invoices for the VAT register
  const vatInvoices = invoices.filter((inv) => !inv.isDraft && inv.type === "VAT");

  const totalNet = vatInvoices.reduce((sum, inv) => sum + parseFloat(inv.totalNet || "0"), 0);
  const totalVat = vatInvoices.reduce((sum, inv) => sum + parseFloat(inv.totalVat || "0"), 0);
  const totalGross = vatInvoices.reduce((sum, inv) => sum + parseFloat(inv.totalGross || "0"), 0);

  return (
    <AppShell title="Rejestr VAT sprzedaży" subtitle="Zestawienie wszystkich faktur VAT wystawionych przez Ciebie." userEmail={user.email} avatarUrl={profile?.avatarUrl} maxWidth="max-w-[1400px]">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Łącznie netto", value: formatPlnCurrency(totalNet.toFixed(2)) },
            { label: "Łącznie VAT", value: formatPlnCurrency(totalVat.toFixed(2)) },
            { label: "Łącznie brutto", value: formatPlnCurrency(totalGross.toFixed(2)) },
          ].map((s) => (
            <Card key={s.label} className="p-4">
              <p className="text-sm text-black/60 dark:text-white/60">{s.label}</p>
              <p className="font-display text-2xl mt-1">{s.value}</p>
            </Card>
          ))}
        </div>

        <Card>
          {vatInvoices.length === 0 ? (
            <p className="text-center py-12 text-black/60 dark:text-white/60">Brak faktur VAT sprzedaży w rejestrze.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-[#E5E5E5] dark:border-[#262626]">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/5 text-xs font-semibold uppercase tracking-wider dark:bg-white/5">
                  <tr>
                    <th className="px-4 py-3">Lp.</th>
                    <th className="px-4 py-3">Numer faktury</th>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Nabywca</th>
                    <th className="px-4 py-3">NIP nabywcy</th>
                    <th className="px-4 py-3">Netto</th>
                    <th className="px-4 py-3">VAT</th>
                    <th className="px-4 py-3">Brutto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#262626]">
                  {vatInvoices.map((inv, i) => (
                    <tr key={inv.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">{i + 1}</td>
                      <td className="px-4 py-3 font-medium">{inv.number}</td>
                      <td className="px-4 py-3 text-black/60 dark:text-white/60">{inv.issueDate}</td>
                      <td className="px-4 py-3">{inv.client.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-black/60 dark:text-white/60">{inv.client.nip || "—"}</td>
                      <td className="px-4 py-3">{formatPlnCurrency(inv.totalNet)}</td>
                      <td className="px-4 py-3">{formatPlnCurrency(inv.totalVat)}</td>
                      <td className="px-4 py-3 font-semibold">{formatPlnCurrency(inv.totalGross)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-black/5 dark:bg-white/5 font-semibold text-sm">
                  <tr>
                    <td colSpan={5} className="px-4 py-3">Razem</td>
                    <td className="px-4 py-3">{formatPlnCurrency(totalNet.toFixed(2))}</td>
                    <td className="px-4 py-3">{formatPlnCurrency(totalVat.toFixed(2))}</td>
                    <td className="px-4 py-3">{formatPlnCurrency(totalGross.toFixed(2))}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
