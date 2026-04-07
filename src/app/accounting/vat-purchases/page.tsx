import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { SupabaseCostRepository } from "@/infrastructure/supabase/queries/cost-repository";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { formatPlnCurrency } from "@/core/use-cases/format-currency";

export const metadata = { title: "Rejestr VAT zakupów | Faktura In" };

export default async function VatPurchasesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [costsList, profile] = await Promise.all([
    new SupabaseCostRepository().listByUser(user.id).catch(() => []),
    new SupabaseProfileRepository().getById(user.id).catch(() => null),
  ]);

  const totalNet = costsList.reduce((s, c) => s + parseFloat(c.totalNet || "0"), 0);
  const totalVat = costsList.reduce((s, c) => s + parseFloat(c.totalVat || "0"), 0);
  const totalGross = costsList.reduce((s, c) => s + parseFloat(c.totalGross || "0"), 0);

  return (
    <AppShell title="Rejestr VAT zakupów" subtitle="Zestawienie wszystkich kosztów z naliczonym podatkiem VAT." userEmail={user.email} avatarUrl={profile?.avatarUrl} maxWidth="max-w-[1400px]">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Łącznie netto", value: formatPlnCurrency(totalNet.toFixed(2)) },
            { label: "Łącznie VAT do odliczenia", value: formatPlnCurrency(totalVat.toFixed(2)) },
            { label: "Łącznie brutto", value: formatPlnCurrency(totalGross.toFixed(2)) },
          ].map((s) => (
            <Card key={s.label} className="p-4">
              <p className="text-sm text-black/60 dark:text-white/60">{s.label}</p>
              <p className="font-display text-2xl mt-1">{s.value}</p>
            </Card>
          ))}
        </div>

        <Card>
          {costsList.length === 0 ? (
            <p className="text-center py-12 text-black/60 dark:text-white/60">Brak dokumentów kosztowych w rejestrze VAT zakupów.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-[#E5E5E5] dark:border-[#262626]">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/5 text-xs font-semibold uppercase tracking-wider dark:bg-white/5">
                  <tr>
                    <th className="px-4 py-3">Lp.</th>
                    <th className="px-4 py-3">Numer dokumentu</th>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Dostawca</th>
                    <th className="px-4 py-3">NIP dostawcy</th>
                    <th className="px-4 py-3">Netto</th>
                    <th className="px-4 py-3">VAT</th>
                    <th className="px-4 py-3">Brutto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#262626]">
                  {costsList.map((cost, i) => (
                    <tr key={cost.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-black/50 dark:text-white/50">{i + 1}</td>
                      <td className="px-4 py-3 font-medium font-mono text-xs">{cost.number}</td>
                      <td className="px-4 py-3 text-black/60 dark:text-white/60">{cost.issueDate}</td>
                      <td className="px-4 py-3">{cost.vendorName}</td>
                      <td className="px-4 py-3 font-mono text-xs text-black/60 dark:text-white/60">{cost.vendorNip || "—"}</td>
                      <td className="px-4 py-3">{formatPlnCurrency(cost.totalNet)}</td>
                      <td className="px-4 py-3">{formatPlnCurrency(cost.totalVat)}</td>
                      <td className="px-4 py-3 font-semibold">{formatPlnCurrency(cost.totalGross)}</td>
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
