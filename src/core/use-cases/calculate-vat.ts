import Decimal from "decimal.js";

import type { InvoiceItemInput, VatRate } from "@/core/domain/types/invoice";

const NO_VAT_RATES: VatRate[] = ["zw", "np", "0"];

function decimalFromValue(value: string | number): Decimal {
  return new Decimal(value || 0);
}

function decimalFromVatRate(vatRate: VatRate): Decimal {
  if (NO_VAT_RATES.includes(vatRate)) {
    return new Decimal(0);
  }

  return new Decimal(Number(vatRate)).dividedBy(100);
}

export interface InvoiceItemTotals {
  net: string;
  vat: string;
  gross: string;
}

export interface InvoiceTotals {
  net: string;
  vat: string;
  gross: string;
}

export function roundMoney(amount: Decimal): string {
  return amount.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2);
}

export function calculateInvoiceItemTotals(item: InvoiceItemInput): InvoiceItemTotals {
  const quantity = decimalFromValue(item.quantity);
  const netPrice = decimalFromValue(item.netPrice);
  const netAmount = quantity.mul(netPrice);
  const vatAmount = netAmount.mul(decimalFromVatRate(item.vatRate));
  const grossAmount = netAmount.add(vatAmount);

  return {
    net: roundMoney(netAmount),
    vat: roundMoney(vatAmount),
    gross: roundMoney(grossAmount),
  };
}

export function calculateInvoiceTotals(items: InvoiceItemInput[]): InvoiceTotals {
  const totals = items.reduce(
    (accumulator, item) => {
      const row = calculateInvoiceItemTotals(item);

      return {
        net: accumulator.net.add(row.net),
        vat: accumulator.vat.add(row.vat),
        gross: accumulator.gross.add(row.gross),
      };
    },
    {
      net: new Decimal(0),
      vat: new Decimal(0),
      gross: new Decimal(0),
    },
  );

  return {
    net: roundMoney(totals.net),
    vat: roundMoney(totals.vat),
    gross: roundMoney(totals.gross),
  };
}

export function calculateGrossFromNet(netValue: string, vatRate: VatRate): string {
  const net = decimalFromValue(netValue);
  const gross = net.mul(new Decimal(1).add(decimalFromVatRate(vatRate)));

  return roundMoney(gross);
}
