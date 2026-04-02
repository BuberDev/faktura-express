export type InvoiceType = "VAT" | "Proforma" | "Correction";

export type InvoiceStatus = "unpaid" | "paid";

export type InvoiceUnit = "szt" | "godz" | "km";

export type VatRate = "23" | "8" | "5" | "0" | "zw" | "np";

export interface InvoiceItemInput {
  description: string;
  quantity: number;
  unit: InvoiceUnit;
  netPrice: string;
  vatRate: VatRate;
}

export interface InvoiceParty {
  name: string;
  nip: string;
  address: string;
  email?: string;
}
