import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { SupabaseInvoiceRepository } from "@/infrastructure/supabase/queries/invoice-repository";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { formatPlnCurrency } from "@/core/use-cases/format-currency";

export const metadata = { title: "Ewidencja przychodów | Faktura In" };

export default async function RevenuesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [invoices, profile] = await Promise.all([
    new SupabaseInvoiceRepository().listByUser(user.id).catch(() => []),
    new SupabaseProfileRepository().getById(user.id).catch(() => null),
  ]);

  const paid = invoices.filter((i) => i.status === "paid" && !i.isDraft);
  const unpaid = invoices.filter((i) => i.status === "unpaid" && !i.isDraft);
  const totalRevenue = paid.reduce((s, i) => s + parseFloat(i.totalGross || "0"), 0);
  const totalExpected = unpaid.reduce((s, i) => s + parseFloat(i.totalGross || "0"), 0);

  return (
    <AppShell title="Ewidencja przychodów" subtitle="Przegląd wszystkich przychodów z wystawionych faktur." userEmail={user.email} avatarUrl={profile?.avatarUrl} maxWidth="max-w-[1400px]">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-4 border-green-500/20">
            <p className="text-sm text-black/60 dark:text-white/60">Przychody opłacone</p>
            <p className="font-display text-2xl mt-1 text-green-600 dark:text-green-400">{formatPlnCurrency(totalRevenue.toFixed(2))}</p>
            <p className="text-xs text-black/50 dark:text-white/50 mt-1">{paid.length} faktur</p>
          </Card>
          <Card className="p-4 border-gold-subtle">
            <p className="text-sm text-black/60 dark:text-white/60">Oczekujące na płatność</p>
            <p className="font-display text-2xl mt-1 text-gold-dark dark:text-gold-light">{formatPlnCurrency(totalExpected.toFixed(2))}</p>
            <p className="text-xs text-black/50 dark:text-white/50 mt-1">{unpaid.length} faktur</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-black/60 dark:text-white/60">Łącznie wystawiono</p>
            <p className="font-display text-2xl mt-1">{formatPlnCurrency((totalRevenue + totalExpected).toFixed(2))}</p>
            <p className="text-xs text-black/50 dark:text-white/50 mt-1">{invoices.filter(i=>!i.isDraft).length} faktur</p>
          </Card>
        </div>

        <Card>
          {invoices.filter(i => !i.isDraft).length === 0 ? (
            <p className="text-center py-12 text-black/60 dark:text-white/60">Brak przychodów do wyświetlenia.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-[#E5E5E5] dark:border-[#262626]">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/5 text-xs font-semibold uppercase tracking-wider dark:bg-white/5">
                  <tr>
                    <th className="px-4 py-3">Numer</th>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Klient</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Netto</th>
                    <th className="px-4 py-3">Brutto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#262626]">
                  {invoices.filter(i => !i.isDraft).map((inv) => (
                    <tr key={inv.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="px-4 py-3 font-medium">{inv.number}</td>
                      <td className="px-4 py-3 text-black/60 dark:text-white/60">{inv.issueDate}</td>
                      <td className="px-4 py-3">{inv.client.name}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${inv.status === "paid" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-gold/10 text-gold-dark dark:text-gold-light"}`}>
                          {inv.status === "paid" ? "Opłacona" : "Nieopłacona"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{formatPlnCurrency(inv.totalNet)}</td>
                      <td className="px-4 py-3 font-semibold">{formatPlnCurrency(inv.totalGross)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
