import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  RevenueAreaChart,
  InvoiceStatusDonut,
  TopClientsBar,
  RecentInvoicesTable,
  type MonthlyRevenue,
  type InvoiceStatusData,
  type TopClientData,
  type RecentInvoiceRow,
} from "@/components/dashboard/dashboard-charts";
import { SupabaseInvoiceRepository } from "@/infrastructure/supabase/queries/invoice-repository";
import { SupabaseCostRepository } from "@/infrastructure/supabase/queries/cost-repository";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { formatPlnCurrency } from "@/core/use-cases/format-currency";

const POLISH_MONTHS = [
  "Sty", "Lut", "Mar", "Kwi", "Maj", "Cze",
  "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru",
];

function toNum(v: string | number | null | undefined): number {
  if (v === null || v === undefined) return 0;
  return parseFloat(String(v)) || 0;
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const repository = new SupabaseInvoiceRepository();
  const costRepository = new SupabaseCostRepository();
  const profileRepository = new SupabaseProfileRepository();

  const [invoices, costs, profile] = await Promise.all([
    repository.listByUser(user.id).catch(() => []),
    costRepository.listByUser(user.id).catch(() => []),
    profileRepository.getById(user.id).catch(() => null),
  ]);

  const now = new Date();
  const currentYear = now.getFullYear();

  // ── KPI ─────────────────────────────────────────────────────────────────────
  const totalRevenueYtd = invoices
    .filter((inv) => new Date(inv.issueDate).getFullYear() === currentYear)
    .reduce((s, inv) => s + toNum(inv.totalGross), 0);

  const totalCostsYtd = costs
    .filter((cost) => new Date(cost.issueDate).getFullYear() === currentYear)
    .reduce((s, cost) => s + toNum(cost.totalGross), 0);

  const netProfitYtd = totalRevenueYtd - totalCostsYtd;

  const pendingInvoices = invoices.filter((inv) => inv.status === "unpaid").length;
  const pendingCosts = costs.filter((cost) => cost.status === "unpaid").length;

  // ── Monthly Analytics (12 months) ──────────────────────────────────────────────
  const monthlyMap = new Map<string, { brutto: number; costs: number }>();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(currentYear, now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(key, { brutto: 0, costs: 0 });
  }
  
  for (const inv of invoices) {
    const d = new Date(inv.issueDate);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (monthlyMap.has(key)) {
      monthlyMap.get(key)!.brutto += toNum(inv.totalGross);
    }
  }

  for (const cost of costs) {
    const d = new Date(cost.issueDate);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (monthlyMap.has(key)) {
      monthlyMap.get(key)!.costs += toNum(cost.totalGross);
    }
  }

  const monthlyRevenue: MonthlyRevenue[] = Array.from(monthlyMap.entries()).map(
    ([key, vals]) => {
      const monthNum = parseInt(key.split("-")[1], 10) - 1;
      return { month: POLISH_MONTHS[monthNum], brutto: vals.brutto, netto: vals.costs }; 
    }
  );

  // ── Status Analytics ─────────────────────────────────────────────────────────────
  const statusData: InvoiceStatusData[] = [
    { name: "Przychody opłacone", value: invoices.filter((inv) => inv.status === "paid").length },
    { name: "Koszty opłacone", value: costs.filter((cost) => cost.status === "paid").length },
  ];

  // ── Top Clients (Revenue based) ──────────────────────────────────────────────
  const clientMap = new Map<string, number>();
  for (const inv of invoices) {
    clientMap.set(
      inv.client.name,
      (clientMap.get(inv.client.name) ?? 0) + toNum(inv.totalGross)
    );
  }
  const topClients: TopClientData[] = Array.from(clientMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([client, brutto]) => ({ client, brutto }));

  // ── Recent Activity ──────────────────────────────────────────────────────────
  const recentRows: RecentInvoiceRow[] = [
    ...invoices.slice(0, 4).map(inv => ({
      number: inv.number,
      client: inv.client.name,
      date: new Date(inv.issueDate).toLocaleDateString("pl-PL"),
      gross: toNum(inv.totalGross),
      status: inv.status as "paid" | "unpaid",
      type: "Przychód"
    })),
    ...costs.slice(0, 4).map(cost => ({
      number: cost.number,
      client: cost.vendorName,
      date: new Date(cost.issueDate).toLocaleDateString("pl-PL"),
      gross: toNum(cost.totalGross),
      status: cost.status as "paid" | "unpaid",
      type: "Koszt"
    }))
  ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <AppShell
      title="Panel główny"
      subtitle="Podsumowanie finansowe: przychody vs. koszty."
      userEmail={user.email}
      avatarUrl={profile?.avatarUrl}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4 border-gold-subtle/20">
            <p className="text-xs text-white/50 uppercase tracking-wider">Przychody (rok)</p>
            <p className="font-display text-2xl mt-1 text-gold-metallic bg-clip-text">{formatPlnCurrency(totalRevenueYtd.toFixed(2))}</p>
          </Card>
          <Card className="p-4 border-gold-subtle/20">
            <p className="text-xs text-white/50 uppercase tracking-wider">Koszty (rok)</p>
            <p className="font-display text-2xl mt-1 text-red-500/80">{formatPlnCurrency(totalCostsYtd.toFixed(2))}</p>
          </Card>
          <Card className="p-4 border-gold-subtle/20 bg-gold/5">
            <p className="text-xs text-white/50 uppercase tracking-wider">Wynik (Netto)</p>
            <p className={cn("font-display text-2xl mt-1", netProfitYtd >= 0 ? "text-green-500" : "text-red-500")}>
              {formatPlnCurrency(netProfitYtd.toFixed(2))}
            </p>
          </Card>
          <Card className="p-4 border-gold-subtle/20">
            <p className="text-xs text-white/50 uppercase tracking-wider">Nieopłacone (Suma)</p>
            <p className="font-display text-2xl mt-1">{pendingInvoices + pendingCosts}</p>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 min-w-0">
          <div className="lg:col-span-2 min-w-0 overflow-hidden">
            <RevenueAreaChart data={monthlyRevenue} />
          </div>
          <div className="min-w-0 overflow-hidden">
            <InvoiceStatusDonut data={statusData} />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 min-w-0">
          {topClients.length > 0 && <TopClientsBar data={topClients} />}
          <RecentInvoicesTable rows={recentRows} />
        </div>
      </div>
    </AppShell>
  );
}
