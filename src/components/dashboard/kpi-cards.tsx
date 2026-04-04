"use client";

import { TrendingUp, TrendingDown, FileText, CheckCircle2, Clock, BarChart2 } from "lucide-react";

interface KpiCardsProps {
  totalRevenueYtd: number;
  totalRevenueLastYear: number;
  pendingInvoices: number;
  paidThisMonth: number;
  avgInvoiceValue: number;
  totalInvoices: number;
}

function formatPln(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value);
}

function GrowthBadge({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return null;
  const pct = ((current - previous) / previous) * 100;
  const isUp = pct >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
        isUp
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      {isUp ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

export function KpiCards({
  totalRevenueYtd,
  totalRevenueLastYear,
  pendingInvoices,
  paidThisMonth,
  avgInvoiceValue,
  totalInvoices,
}: KpiCardsProps) {
  const cards = [
    {
      label: "Przychód YTD",
      value: formatPln(totalRevenueYtd),
      sub: <GrowthBadge current={totalRevenueYtd} previous={totalRevenueLastYear} />,
      icon: <BarChart2 className="h-5 w-5 text-gold" />,
      accent: true,
    },
    {
      label: "Faktury oczekujące",
      value: pendingInvoices.toString(),
      sub: <span className="text-xs text-white/40">do opłacenia</span>,
      icon: <Clock className="h-5 w-5 text-gold" />,
    },
    {
      label: "Opłacone w tym miesiącu",
      value: paidThisMonth.toString(),
      sub: <span className="text-xs text-white/40">z {totalInvoices} wszystkich</span>,
      icon: <CheckCircle2 className="h-5 w-5 text-gold" />,
    },
    {
      label: "Średnia wartość faktury",
      value: formatPln(avgInvoiceValue),
      sub: <span className="text-xs text-white/40">brutto</span>,
      icon: <FileText className="h-5 w-5 text-gold" />,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:shadow-gold-md hover:-translate-y-0.5 ${
            card.accent
              ? "border border-gold/30 bg-gradient-to-br from-gold/10 via-black/60 to-black/40 backdrop-blur-md shadow-gold-sm"
              : "border border-[#262626] bg-black/40 backdrop-blur-md"
          }`}
        >
          {/* Glow dla accent card */}
          {card.accent && (
            <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-gold/10 blur-2xl" />
          )}

          <div className="flex items-start justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-white/50">
              {card.label}
            </p>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-gold/10">
              {card.icon}
            </div>
          </div>

          <p className={`mt-3 font-display text-3xl font-bold tracking-tight ${card.accent ? "text-gold-light" : "text-white"}`}>
            {card.value}
          </p>

          <div className="mt-2 flex items-center gap-2">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
