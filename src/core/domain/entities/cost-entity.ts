import type { VatRate, InvoiceUnit } from "../types/invoice";

export type CostType = "invoice" | "purchase" | "order" | "ksef";
export type CostStatus = "unpaid" | "paid";

export interface CostItemEntity {
  description: string;
  quantity: number;
  unit: InvoiceUnit;
  netPrice: string;
  vatRate: VatRate;
}

export interface CostEntity {
  id: string;
  userId: string;
  number: string;
  type: CostType;
  issueDate: string;
  dueDate: string;
  status: CostStatus;
  vendorName: string;
  vendorNip: string | null;
  vendorAddress: string | null;
  totalNet: string;
  totalVat: string;
  totalGross: string;
  ksefId: string | null;
  notes: string | null;
  items: CostItemEntity[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type CreateCostInput = Omit<CostEntity, "id" | "createdAt" | "updatedAt">;
