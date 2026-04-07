export interface PaymentMethodEntity {
  id: string;
  userId: string;
  name: string;
  dueDays: number;
  isDefault: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type CreatePaymentMethodInput = Omit<PaymentMethodEntity, "id" | "createdAt" | "updatedAt">;
export type UpdatePaymentMethodInput = Partial<Omit<PaymentMethodEntity, "id" | "userId" | "createdAt" | "updatedAt">>;
