import { eq } from "drizzle-orm";
import type { BankAccountEntity, CreateBankAccountInput, UpdateBankAccountInput } from "@/core/domain/entities/bank-account-entity";
import { db } from "@/infrastructure/supabase/db";
import { bankAccounts } from "@/core/domain/schema";

export class SupabaseBankAccountRepository {
  async listByUser(userId: string): Promise<BankAccountEntity[]> {
    const results = await db.query.bankAccounts.findMany({
      where: eq(bankAccounts.userId, userId),
    });
    return results.map(this.mapToEntity);
  }

  async create(input: CreateBankAccountInput): Promise<string> {
    // If new account is default, unset others
    if (input.isDefault) {
      await db.update(bankAccounts)
        .set({ isDefault: false })
        .where(eq(bankAccounts.userId, input.userId));
    }

    const [inserted] = await db
      .insert(bankAccounts)
      .values({
        userId: input.userId,
        name: input.name,
        iban: input.iban,
        bankName: input.bankName,
        currency: input.currency,
        isDefault: input.isDefault,
      })
      .returning({ id: bankAccounts.id });

    if (!inserted) throw new Error("Failed to create bank account");
    return inserted.id;
  }

  async update(id: string, userId: string, input: UpdateBankAccountInput): Promise<void> {
    if (input.isDefault) {
      await db.update(bankAccounts)
        .set({ isDefault: false })
        .where(eq(bankAccounts.userId, userId));
    }

    await db.update(bankAccounts)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(bankAccounts.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(bankAccounts).where(eq(bankAccounts.id, id));
  }

  private mapToEntity(row: typeof bankAccounts.$inferSelect): BankAccountEntity {
    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      iban: row.iban,
      bankName: row.bankName,
      currency: row.currency,
      isDefault: row.isDefault,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
