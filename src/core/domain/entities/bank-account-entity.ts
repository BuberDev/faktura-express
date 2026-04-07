export interface BankAccountEntity {
  id: string;
  userId: string;
  name: string;
  iban: string;
  bankName: string | null;
  currency: string;
  isDefault: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type CreateBankAccountInput = Omit<BankAccountEntity, "id" | "createdAt" | "updatedAt">;
export type UpdateBankAccountInput = Partial<Omit<BankAccountEntity, "id" | "userId" | "createdAt" | "updatedAt">>;
