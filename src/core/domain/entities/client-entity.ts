export interface ClientEntity {
  id: string;
  userId: string;
  name: string;
  nip: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  bankAccount: string | null;
  notes: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type CreateClientInput = Omit<ClientEntity, "id" | "createdAt" | "updatedAt">;
export type UpdateClientInput = Partial<Omit<ClientEntity, "id" | "userId" | "createdAt" | "updatedAt">>;
