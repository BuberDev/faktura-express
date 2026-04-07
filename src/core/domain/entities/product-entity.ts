import type { VatRate, InvoiceUnit } from "../types/invoice";

export interface ProductEntity {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  unit: InvoiceUnit;
  netPrice: string;
  vatRate: VatRate;
  sku: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type CreateProductInput = Omit<ProductEntity, "id" | "createdAt" | "updatedAt">;
export type UpdateProductInput = Partial<Omit<ProductEntity, "id" | "userId" | "createdAt" | "updatedAt">>;
