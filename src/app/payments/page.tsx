import { redirect } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SupabaseInvoiceRepository } from "@/infrastructure/supabase/queries/invoice-repository";
import { SupabaseCostRepository } from "@/infrastructure/supabase/queries/cost-repository";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { formatPlnCurrency } from "@/core/use-cases/format-currency";
import { cn } from "@/lib/utils";

export const metadata = { title: "Płatności | Faktura In" };

export default async function PaymentsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [invoices, costsList, profile] = await Promise.all([
    new SupabaseInvoiceRepository().listByUser(user.id).catch(() => []),
    new SupabaseCostRepository().listByUser(user.id).catch(() => []),
    new SupabaseProfileRepository().getById(user.id).catch(() => null),
  ]);

  const unpaidInvoices = invoices.filter((i) => i.status === "unpaid" && !i.isDraft);
  const unpaidCosts = costsList.filter((c) => c.status === "unpaid");

  const totalReceivable = unpaidInvoices.reduce((s, i) => s + parseFloat(i.totalGross || "0"), 0);
  const totalPayable = unpaidCosts.reduce((s, c) => s + parseFloat(c.totalGross || "0"), 0);

  const today = new Date().toISOString().slice(0, 10);
  const overdueInvoices = unpaidInvoices.filter((i) => i.dueDate < today);
  const overdueCosts = unpaidCosts.filter((c) => c.dueDate < today);

  return (
    <AppShell title="Płatności" subtitle="Przegląd należności i zobowiązań." userEmail={user.email} avatarUrl={profile?.avatarUrl} maxWidth="max-w-[1400px]">
      <div className="space-y-6">
        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4 border-green-500/20">
            <p className="text-xs text-black/60 dark:text-white/60 uppercase tracking-wide">Należności (do otrzymania)</p>
            <p className="font-display text-2xl mt-1 text-green-600 dark:text-green-400">{formatPlnCurrency(totalReceivable.toFixed(2))}</p>
            <p className="text-xs text-black/50 dark:text-white/50 mt-1">{unpaidInvoices.length} nieopłaconych faktur</p>
          </Card>
          <Card className="p-4 border-red-500/20">
            <p className="text-xs text-black/60 dark:text-white/60 uppercase tracking-wide">Zobowiązania (do zapłaty)</p>
            <p className="font-display text-2xl mt-1 text-red-600 dark:text-red-400">{formatPlnCurrency(totalPayable.toFixed(2))}</p>
            <p className="text-xs text-black/50 dark:text-white/50 mt-1">{unpaidCosts.length} nieopłaconych kosztów</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-black/60 dark:text-white/60 uppercase tracking-wide">Przeterminowane należności</p>
            <p className="font-display text-2xl mt-1">{overdueInvoices.length}</p>
            <p className="text-xs text-black/50 dark:text-white/50 mt-1">faktur po terminie</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-black/60 dark:text-white/60 uppercase tracking-wide">Przeterminowane zobowiązania</p>
            <p className="font-display text-2xl mt-1">{overdueCosts.length}</p>
            <p className="text-xs text-black/50 dark:text-white/50 mt-1">kosztów po terminie</p>
          </Card>
        </div>

        {/* Unpaid invoices */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Oczekujące należności</h2>
            <Link href="/invoices/sales"><Button variant="outline" size="sm">Zarządzaj fakturami</Button></Link>
          </div>
          {unpaidInvoices.length === 0 ? (
            <p className="text-sm text-black/60 dark:text-white/60 py-4">Brak niezapłaconych faktur. Świetnie!</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-[#E5E5E5] dark:border-[#262626]">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/5 text-xs font-semibold uppercase tracking-wider dark:bg-white/5">
                  <tr>
                    <th className="px-4 py-3">Numer</th>
                    <th className="px-4 py-3">Klient</th>
                    <th className="px-4 py-3">Termin</th>
                    <th className="px-4 py-3">Kwota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#262626]">
                  {unpaidInvoices.map((inv) => {
                    const overdue = inv.dueDate < today;
                    return (
                      <tr key={inv.id} className={cn("hover:bg-black/[0.02] dark:hover:bg-white/[0.02]", overdue && "bg-red-500/5")}>
                        <td className="px-4 py-3 font-medium">{inv.number}</td>
                        <td className="px-4 py-3">{inv.client.name}</td>
                        <td className={cn("px-4 py-3", overdue ? "text-red-500 font-semibold" : "text-black/60 dark:text-white/60")}>
                          {inv.dueDate}{overdue && " (po terminie)"}
                        </td>
                        <td className="px-4 py-3 font-semibold">{formatPlnCurrency(inv.totalGross)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Unpaid costs */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Oczekujące zobowiązania</h2>
            <Link href="/costs/invoices"><Button variant="outline" size="sm">Zarządzaj kosztami</Button></Link>
          </div>
          {unpaidCosts.length === 0 ? (
            <p className="text-sm text-black/60 dark:text-white/60 py-4">Brak nieopłaconych kosztów.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-[#E5E5E5] dark:border-[#262626]">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/5 text-xs font-semibold uppercase tracking-wider dark:bg-white/5">
                  <tr>
                    <th className="px-4 py-3">Numer</th>
                    <th className="px-4 py-3">Dostawca</th>
                    <th className="px-4 py-3">Termin</th>
                    <th className="px-4 py-3">Kwota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#262626]">
                  {unpaidCosts.map((cost) => {
                    const overdue = cost.dueDate < today;
                    return (
                      <tr key={cost.id} className={cn("hover:bg-black/[0.02] dark:hover:bg-white/[0.02]", overdue && "bg-red-500/5")}>
                        <td className="px-4 py-3 font-mono text-xs font-medium">{cost.number}</td>
                        <td className="px-4 py-3">{cost.vendorName}</td>
                        <td className={cn("px-4 py-3", overdue ? "text-red-500 font-semibold" : "text-black/60 dark:text-white/60")}>
                          {cost.dueDate}{overdue && " (po terminie)"}
                        </td>
                        <td className="px-4 py-3 font-semibold">{formatPlnCurrency(cost.totalGross)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
