import { eq } from "drizzle-orm";
import type { PaymentMethodEntity, CreatePaymentMethodInput, UpdatePaymentMethodInput } from "@/core/domain/entities/payment-method-entity";
import { db } from "@/infrastructure/supabase/db";
import { paymentMethods } from "@/core/domain/schema";

export class SupabasePaymentMethodRepository {
  async listByUser(userId: string): Promise<PaymentMethodEntity[]> {
    const results = await db.query.paymentMethods.findMany({
      where: eq(paymentMethods.userId, userId),
    });
    return results.map(this.mapToEntity);
  }

  async create(input: CreatePaymentMethodInput): Promise<string> {
    if (input.isDefault) {
      await db.update(paymentMethods)
        .set({ isDefault: false })
        .where(eq(paymentMethods.userId, input.userId));
    }

    const [inserted] = await db
      .insert(paymentMethods)
      .values({
        userId: input.userId,
        name: input.name,
        dueDays: input.dueDays.toString(),
        isDefault: input.isDefault,
      })
      .returning({ id: paymentMethods.id });

    if (!inserted) throw new Error("Failed to create payment method");
    return inserted.id;
  }

  async update(id: string, userId: string, input: UpdatePaymentMethodInput): Promise<void> {
    if (input.isDefault) {
      await db.update(paymentMethods)
        .set({ isDefault: false })
        .where(eq(paymentMethods.userId, userId));
    }

    await db.update(paymentMethods)
      .set({
        name: input.name,
        dueDays: input.dueDays !== undefined ? input.dueDays.toString() : undefined,
        isDefault: input.isDefault,
        updatedAt: new Date(),
      })
      .where(eq(paymentMethods.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(paymentMethods).where(eq(paymentMethods.id, id));
  }

  private mapToEntity(row: typeof paymentMethods.$inferSelect): PaymentMethodEntity {
    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      dueDays: parseInt(row.dueDays, 10),
      isDefault: row.isDefault,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
