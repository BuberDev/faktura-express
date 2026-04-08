"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MonthlyRevenue {
  month: string;
  brutto: number; // Revenue
  netto: number;  // Costs
}

export interface InvoiceStatusData {
  name: string;
  value: number;
}

export interface InvoiceTypeData {
  name: string;
  count: number;
}

export interface TopClientData {
  client: string;
  brutto: number;
}

// ─── Shared Tooltip Styles ────────────────────────────────────────────────────

const tooltipWrapperStyle: React.CSSProperties = {
  background: "#111111",
  border: "1px solid rgba(212,175,55,0.25)",
  borderRadius: "0.5rem",
  color: "#fff",
  fontSize: "0.8rem",
};

function formatPln(v: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(v);
}

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F9E79F";
const WHITE_30 = "rgba(255,255,255,0.3)";
const WHITE_10 = "rgba(255,255,255,0.08)";
const GOLD_GRADIENT_ID = "goldGradient";
const NETTO_GRADIENT_ID = "nettoGradient";

function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

// ─── 1. Revenue Area Chart ────────────────────────────────────────────────────

export function RevenueAreaChart({ data, title = "Przychód miesięczny" }: { data: MonthlyRevenue[]; title?: string }) {
  const isMounted = useIsMounted();
  
  return (
    <div className="rounded-xl border border-[#262626] bg-black/40 backdrop-blur-md p-6 overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60">
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-white/35">przychody vs. koszty (PLN)</p>
        </div>
        <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs text-gold-light">
          Ostatnie 12 mies.
        </span>
      </div>

      <div className="h-[240px] w-full min-w-0">
        {isMounted && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={GOLD_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GOLD} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
                <linearGradient id={NETTO_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={WHITE_30} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={WHITE_30} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={WHITE_10} vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                formatter={(value: any, name: any) => [
                  formatPln(Number(value || 0)),
                  String(name || "") === "brutto" ? "Brutto" : "Netto",
                ]}
                contentStyle={tooltipWrapperStyle}
                cursor={{ stroke: GOLD, strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Area
                type="monotone"
                dataKey="netto"
                stroke={WHITE_30}
                strokeWidth={1.5}
                fill={`url(#${NETTO_GRADIENT_ID})`}
              />
              <Area
                type="monotone"
                dataKey="brutto"
                stroke={GOLD}
                strokeWidth={2}
                fill={`url(#${GOLD_GRADIENT_ID})`}
                dot={false}
                activeDot={{ r: 5, fill: GOLD, stroke: "#000", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ─── 2. Invoice Status Donut ──────────────────────────────────────────────────

const STATUS_COLORS = [GOLD, "rgba(255,255,255,0.2)"];

export function InvoiceStatusDonut({ data, title = "Status faktur" }: { data: InvoiceStatusData[]; title?: string }) {
  const isMounted = useIsMounted();
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="rounded-xl border border-[#262626] bg-black/40 backdrop-blur-md p-6 overflow-hidden">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60">
          {title}
        </h3>
        <p className="mt-0.5 text-xs text-white/35">przychody vs. koszty (opłacone)</p>
      </div>

      <div className="flex flex-col items-center">
        <div className="h-[180px] w-full min-w-0">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [Number(value || 0), String(name || "")]}
                  contentStyle={tooltipWrapperStyle}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Center stat */}
        <div className="mt-2 flex flex-col items-center">
          <span className="font-display text-2xl font-bold text-gold-light">{total}</span>
          <span className="text-xs text-white/40">wszystkich faktur</span>
        </div>

        {/* Legend */}
        <div className="mt-4 flex w-full flex-col gap-2">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: STATUS_COLORS[i] }}
                />
                <span className="text-xs text-white/60">{d.name}</span>
              </div>
              <span className="text-xs font-semibold text-white/80">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 3. Top Clients Bar ───────────────────────────────────────────────────────

export function TopClientsBar({ data }: { data: TopClientData[] }) {
  const isMounted = useIsMounted();
  return (
    <div className="rounded-xl border border-[#262626] bg-black/40 backdrop-blur-md p-6 overflow-hidden">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60">
          Top klienci
        </h3>
        <p className="mt-0.5 text-xs text-white/35">według wartości faktur brutto</p>
      </div>

      <div className="h-[220px] w-full min-w-0">
        {isMounted && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={WHITE_10} horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="client"
                width={90}
                tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(v: any) => [formatPln(Number(v || 0)), "Brutto"]}
                contentStyle={tooltipWrapperStyle}
                cursor={{ fill: "rgba(212,175,55,0.06)" }}
              />
              <Bar dataKey="brutto" radius={[0, 4, 4, 0]} fill={GOLD}>
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === 0 ? GOLD : `rgba(212,175,55,${0.7 - i * 0.12})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ─── 4. Invoice Types Bar ─────────────────────────────────────────────────────

export function InvoiceTypeBar({ data }: { data: InvoiceTypeData[] }) {
  const isMounted = useIsMounted();
  return (
    <div className="rounded-xl border border-[#262626] bg-black/40 backdrop-blur-md p-6 overflow-hidden">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60">
          Typy dokumentów
        </h3>
        <p className="mt-0.5 text-xs text-white/35">liczba wystawionych</p>
      </div>

      <div className="h-[220px] w-full min-w-0">
        {isMounted && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={WHITE_10} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                width={28}
              />
              <Tooltip
                formatter={(v: any) => [Number(v || 0), "Liczba"]}
                contentStyle={tooltipWrapperStyle}
                cursor={{ fill: "rgba(212,175,55,0.06)" }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === 0 ? GOLD : i === 1 ? GOLD_LIGHT : "rgba(255,255,255,0.2)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ─── 5. Recent Invoices Table ─────────────────────────────────────────────────

export interface RecentInvoiceRow {
  number: string;
  client: string;
  date: string;
  gross: number;
  status: "paid" | "unpaid";
  type: string;
}

export function RecentInvoicesTable({ rows, title = "Ostatnie dokumenty" }: { rows: RecentInvoiceRow[]; title?: string }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-[#262626] bg-black/40 backdrop-blur-md p-6 overflow-hidden">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/60">
          Ostatnie faktury
        </h3>
        <p className="py-8 text-center text-sm text-white/30">Brak faktur do wyświetlenia</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#262626] bg-black/40 backdrop-blur-md p-6 overflow-hidden">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60">
          {title}
        </h3>
        <Link href="/invoices" className="text-xs text-gold hover:text-gold-light transition-colors">
          Zobacz wszystkie →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#262626]">
              {["Numer", "Kontrahent", "Rodzaj", "Data", "Brutto", "Status"].map((h) => (
                <th
                  key={h}
                  className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-white/35"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {rows.map((row) => (
              <tr key={row.number} className="group hover:bg-gold/5 transition-colors">
                <td className="py-3 font-mono text-xs text-gold-light">{row.number}</td>
                <td className="py-3 max-w-[160px] truncate text-white/80">{row.client}</td>
                <td className="py-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] uppercase font-bold",
                    row.type === "Przychód" ? "bg-gold/10 text-gold" : "bg-red-500/10 text-red-400"
                  )}>
                    {row.type}
                  </span>
                </td>
                <td className="py-3 text-white/40 text-xs">{row.date}</td>
                <td className="py-3 font-semibold text-white">{formatPln(row.gross)}</td>
                <td className="py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      row.status === "paid"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {row.status === "paid" ? "Opłacona" : "Oczekuje"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
