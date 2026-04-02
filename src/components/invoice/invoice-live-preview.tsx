import { calculateInvoiceTotals } from "@/core/use-cases/calculate-vat";
import { formatPlnCurrency } from "@/core/use-cases/format-currency";
import type { InvoiceFormValues } from "@/lib/schemas/invoice";

interface InvoiceLivePreviewProps {
  values: InvoiceFormValues;
}

export function InvoiceLivePreview({ values }: InvoiceLivePreviewProps) {
  const totals = calculateInvoiceTotals(values.items);

  return (
    <div className="rounded-md border border-gold-subtle bg-gradient-to-b from-white to-[#F9F9F9] p-5 shadow-gold-sm dark:bg-dark-surface">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-2xl text-black dark:text-white">Podgląd na żywo</h3>
        <span className="rounded-md border border-gold-subtle bg-gold/10 px-3 py-1 text-xs uppercase tracking-wide text-gold-dark dark:text-gold-light">
          {values.type}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-black/45 dark:text-white/45">Numer faktury</p>
          <p className="font-semibold">{values.number || "-"}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-black/45 dark:text-white/45">Sprzedawca</p>
            <p>{values.issuerName || "-"}</p>
            <p className="text-black/70 dark:text-white/70">NIP: {values.issuerNip || "-"}</p>
            <p className="text-black/70 dark:text-white/70">{values.issuerAddress || "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-black/45 dark:text-white/45">Nabywca</p>
            <p>{values.clientName || "-"}</p>
            <p className="text-black/70 dark:text-white/70">NIP: {values.clientNip || "-"}</p>
            <p className="text-black/70 dark:text-white/70">{values.clientAddress || "-"}</p>
          </div>
        </div>

        <div className="rounded-md border border-[#E5E5E5] dark:border-[#262626]">
          <div className="grid grid-cols-12 gap-2 border-b border-[#E5E5E5] bg-black/5 px-3 py-2 text-xs font-medium dark:border-[#262626] dark:bg-white/5">
            <p className="col-span-4">Opis</p>
            <p className="col-span-2 text-right">Ilość</p>
            <p className="col-span-2 text-right">Netto</p>
            <p className="col-span-2 text-right">VAT</p>
            <p className="col-span-2 text-right">Brutto</p>
          </div>

          {values.items.map((item, index) => {
            const rowTotals = calculateInvoiceTotals([item]);
            return (
              <div key={`${item.description}-${index}`} className="grid grid-cols-12 gap-2 border-b border-[#E5E5E5] px-3 py-2 text-xs last:border-b-0 dark:border-[#262626]">
                <p className="col-span-4 truncate">{item.description || "Pozycja"}</p>
                <p className="col-span-2 text-right">
                  {item.quantity} {item.unit}
                </p>
                <p className="col-span-2 text-right">{formatPlnCurrency(item.netPrice)}</p>
                <p className="col-span-2 text-right">{item.vatRate}%</p>
                <p className="col-span-2 text-right">{formatPlnCurrency(rowTotals.gross)}</p>
              </div>
            );
          })}
        </div>

        <div className="ml-auto w-full max-w-xs space-y-1 rounded-md border border-gold-subtle bg-gold/5 p-3 text-sm">
          <div className="flex items-center justify-between">
            <span>Razem netto</span>
            <span>{formatPlnCurrency(totals.net)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>VAT</span>
            <span>{formatPlnCurrency(totals.vat)}</span>
          </div>
          <div className="flex items-center justify-between font-semibold text-gold-dark dark:text-gold-light">
            <span>Do zapłaty</span>
            <span>{formatPlnCurrency(totals.gross)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
