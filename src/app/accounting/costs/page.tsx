import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { SupabaseCostRepository } from "@/infrastructure/supabase/queries/cost-repository";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { formatPlnCurrency } from "@/core/use-cases/format-currency";

export const metadata = { title: "Ewidencja kosztów | Faktura In" };

export default async function AccountingCostsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [costsList, profile] = await Promise.all([
    new SupabaseCostRepository().listByUser(user.id).catch(() => []),
    new SupabaseProfileRepository().getById(user.id).catch(() => null),
  ]);

  const paid = costsList.filter((c) => c.status === "paid");
  const unpaid = costsList.filter((c) => c.status === "unpaid");
  const totalPaid = paid.reduce((s, c) => s + parseFloat(c.totalGross || "0"), 0);
  const totalUnpaid = unpaid.reduce((s, c) => s + parseFloat(c.totalGross || "0"), 0);

  return (
    <AppShell title="Ewidencja kosztów" subtitle="Przegląd wszystkich zarejestrowanych kosztów działalności." userEmail={user.email} avatarUrl={profile?.avatarUrl} maxWidth="max-w-[1400px]">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <p className="text-sm text-black/60 dark:text-white/60">Koszty opłacone</p>
            <p className="font-display text-2xl mt-1">{formatPlnCurrency(totalPaid.toFixed(2))}</p>
            <p className="text-xs text-black/50 dark:text-white/50 mt-1">{paid.length} dokument{paid.length !== 1 ? "ów" : ""}</p>
          </Card>
          <Card className="p-4 border-gold-subtle">
            <p className="text-sm text-black/60 dark:text-white/60">Do zapłacenia</p>
            <p className="font-display text-2xl mt-1 text-gold-dark dark:text-gold-light">{formatPlnCurrency(totalUnpaid.toFixed(2))}</p>
            <p className="text-xs text-black/50 dark:text-white/50 mt-1">{unpaid.length} dokument{unpaid.length !== 1 ? "ów" : ""}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-black/60 dark:text-white/60">Łącznie koszty</p>
            <p className="font-display text-2xl mt-1">{formatPlnCurrency((totalPaid + totalUnpaid).toFixed(2))}</p>
            <p className="text-xs text-black/50 dark:text-white/50 mt-1">{costsList.length} dokumentów</p>
          </Card>
        </div>

        <Card>
          {costsList.length === 0 ? (
            <p className="text-center py-12 text-black/60 dark:text-white/60">Brak zarejestrowanych kosztów.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-[#E5E5E5] dark:border-[#262626]">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/5 text-xs font-semibold uppercase tracking-wider dark:bg-white/5">
                  <tr>
                    <th className="px-4 py-3">Numer</th>
                    <th className="px-4 py-3">Typ</th>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Dostawca</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Brutto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#262626]">
                  {costsList.map((cost) => (
                    <tr key={cost.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="px-4 py-3 font-mono text-xs font-medium">{cost.number}</td>
                      <td className="px-4 py-3 text-black/60 dark:text-white/60 capitalize">{cost.type}</td>
                      <td className="px-4 py-3 text-black/60 dark:text-white/60">{cost.issueDate}</td>
                      <td className="px-4 py-3">{cost.vendorName}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${cost.status === "paid" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-gold/10 text-gold-dark dark:text-gold-light"}`}>
                          {cost.status === "paid" ? "Opłacony" : "Nieopłacony"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold">{formatPlnCurrency(cost.totalGross)}</td>
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
