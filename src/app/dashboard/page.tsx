import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import {
  RevenueAreaChart,
  InvoiceStatusDonut,
  TopClientsBar,
  InvoiceTypeBar,
  RecentInvoicesTable,
  type MonthlyRevenue,
  type InvoiceStatusData,
  type InvoiceTypeData,
  type TopClientData,
  type RecentInvoiceRow,
} from "@/components/dashboard/dashboard-charts";
import { SupabaseInvoiceRepository } from "@/infrastructure/supabase/queries/invoice-repository";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

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
  const profileRepository = new SupabaseProfileRepository();

  const [invoices, profile] = await Promise.all([
    repository.listByUser(user.id).catch(() => []),
    profileRepository.getById(user.id).catch(() => null),
  ]);

  const now = new Date();
  const currentYear = now.getFullYear();
  const lastYear = currentYear - 1;

  // ── KPI ─────────────────────────────────────────────────────────────────────
  const totalRevenueYtd = invoices
    .filter((inv) => new Date(inv.issueDate).getFullYear() === currentYear)
    .reduce((s, inv) => s + toNum(inv.totalGross), 0);

  const totalRevenueLastYear = invoices
    .filter((inv) => new Date(inv.issueDate).getFullYear() === lastYear)
    .reduce((s, inv) => s + toNum(inv.totalGross), 0);

  const pendingInvoices = invoices.filter((inv) => inv.status === "unpaid").length;

  const paidThisMonth = invoices.filter((inv) => {
    if (inv.status !== "paid") return false;
    const d = new Date(inv.issueDate);
    return d.getFullYear() === currentYear && d.getMonth() === now.getMonth();
  }).length;

  const avgInvoiceValue =
    invoices.length > 0
      ? invoices.reduce((s, inv) => s + toNum(inv.totalGross), 0) / invoices.length
      : 0;

  // ── Monthly Revenue (12 months) ──────────────────────────────────────────────
  const monthlyMap = new Map<string, { brutto: number; netto: number }>();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(currentYear, now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(key, { brutto: 0, netto: 0 });
  }
  for (const inv of invoices) {
    const d = new Date(inv.issueDate);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (monthlyMap.has(key)) {
      const entry = monthlyMap.get(key)!;
      entry.brutto += toNum(inv.totalGross);
      entry.netto += toNum(inv.totalNet);
    }
  }
  const monthlyRevenue: MonthlyRevenue[] = Array.from(monthlyMap.entries()).map(
    ([key, vals]) => {
      const monthNum = parseInt(key.split("-")[1], 10) - 1;
      return { month: POLISH_MONTHS[monthNum], ...vals };
    }
  );

  // ── Status Donut ─────────────────────────────────────────────────────────────
  const paidCount = invoices.filter((inv) => inv.status === "paid").length;
  const unpaidCount = invoices.filter((inv) => inv.status === "unpaid").length;
  const statusData: InvoiceStatusData[] = [
    { name: "Opłacone", value: paidCount },
    { name: "Oczekujące", value: unpaidCount },
  ];

  // ── Invoice Types ────────────────────────────────────────────────────────────
  const typeMap = new Map<string, number>();
  for (const inv of invoices) {
    typeMap.set(inv.type, (typeMap.get(inv.type) ?? 0) + 1);
  }
  const typeData: InvoiceTypeData[] = Array.from(typeMap.entries()).map(([name, count]) => ({
    name,
    count,
  }));

  // ── Top Clients ──────────────────────────────────────────────────────────────
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

  // ── Recent Invoices ──────────────────────────────────────────────────────────
  const recentRows: RecentInvoiceRow[] = invoices.slice(0, 8).map((inv) => ({
    number: inv.number,
    client: inv.client.name,
    date: new Date(inv.issueDate).toLocaleDateString("pl-PL"),
    gross: toNum(inv.totalGross),
    status: inv.status as "paid" | "unpaid",
  }));

  return (
    <AppShell
      title="Panel główny"
      subtitle="Podsumowanie działalności i analityka faktur."
      userEmail={user.email}
      avatarUrl={profile?.avatarUrl}
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <KpiCards
          totalRevenueYtd={totalRevenueYtd}
          totalRevenueLastYear={totalRevenueLastYear}
          pendingInvoices={pendingInvoices}
          paidThisMonth={paidThisMonth}
          avgInvoiceValue={avgInvoiceValue}
          totalInvoices={invoices.length}
        />

        {/* Revenue Chart + Status Donut */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueAreaChart data={monthlyRevenue} />
          </div>
          <InvoiceStatusDonut data={statusData} />
        </div>

        {/* Top Clients + Invoice Types */}
        <div className="grid gap-4 lg:grid-cols-2">
          {topClients.length > 0 ? (
            <TopClientsBar data={topClients} />
          ) : (
            <div className="rounded-xl border border-[#262626] bg-black/40 backdrop-blur-md p-6 flex items-center justify-center">
              <p className="text-sm text-white/30">Brak danych o klientach</p>
            </div>
          )}
          {typeData.length > 0 ? (
            <InvoiceTypeBar data={typeData} />
          ) : (
            <div className="rounded-xl border border-[#262626] bg-black/40 backdrop-blur-md p-6 flex items-center justify-center">
              <p className="text-sm text-white/30">Brak danych o typach faktur</p>
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <RecentInvoicesTable rows={recentRows} />
      </div>
    </AppShell>
  );
}
