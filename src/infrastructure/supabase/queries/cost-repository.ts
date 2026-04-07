import { eq, desc, and } from "drizzle-orm";
import type { CostEntity, CreateCostInput } from "@/core/domain/entities/cost-entity";
import type { CostType, CostStatus } from "@/core/domain/entities/cost-entity";
import type { VatRate, InvoiceUnit } from "@/core/domain/types/invoice";
import { db } from "@/infrastructure/supabase/db";
import { costs, costItems } from "@/core/domain/schema";

export class SupabaseCostRepository {
  async listByUser(userId: string): Promise<CostEntity[]> {
    const results = await db.query.costs.findMany({
      where: eq(costs.userId, userId),
      orderBy: [desc(costs.issueDate)],
      with: {},
    });
    return results.map((r) => this.mapToEntity(r, []));
  }

  async listByUserAndType(userId: string, type: CostType): Promise<CostEntity[]> {
    const results = await db.query.costs.findMany({
      where: and(eq(costs.userId, userId), eq(costs.type, type)),
      orderBy: [desc(costs.issueDate)],
    });
    return results.map((r) => this.mapToEntity(r, []));
  }

  async getByIdForUser(id: string, userId: string): Promise<CostEntity | null> {
    const result = await db.query.costs.findFirst({
      where: and(eq(costs.id, id), eq(costs.userId, userId)),
      with: { costItems: true },
    });
    if (!result) return null;
    return this.mapToEntity(result, (result as any).costItems ?? []);
  }

  async create(input: CreateCostInput): Promise<string> {
    return await db.transaction(async (tx) => {
      const [inserted] = await tx
        .insert(costs)
        .values({
          userId: input.userId,
          number: input.number,
          type: input.type,
          issueDate: input.issueDate,
          dueDate: input.dueDate,
          status: input.status,
          vendorName: input.vendorName,
          vendorNip: input.vendorNip,
          vendorAddress: input.vendorAddress,
          totalNet: input.totalNet,
          totalVat: input.totalVat,
          totalGross: input.totalGross,
          ksefId: input.ksefId,
          notes: input.notes,
        })
        .returning({ id: costs.id });

      if (!inserted) throw new Error("Failed to create cost");

      if (input.items.length > 0) {
        await tx.insert(costItems).values(
          input.items.map((item) => ({
            costId: inserted.id,
            description: item.description,
            quantity: item.quantity.toString(),
            unit: item.unit,
            netPrice: item.netPrice,
            vatRate: item.vatRate,
          }))
        );
      }

      return inserted.id;
    });
  }

  async updateStatus(id: string, status: CostStatus): Promise<void> {
    await db.update(costs).set({ status, updatedAt: new Date() }).where(eq(costs.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.delete(costItems).where(eq(costItems.costId, id));
      await tx.delete(costs).where(eq(costs.id, id));
    });
  }

  private mapToEntity(row: any, items: any[]): CostEntity {
    return {
      id: row.id,
      userId: row.userId,
      number: row.number,
      type: row.type as CostType,
      issueDate: row.issueDate,
      dueDate: row.dueDate,
      status: row.status as CostStatus,
      vendorName: row.vendorName,
      vendorNip: row.vendorNip,
      vendorAddress: row.vendorAddress,
      totalNet: row.totalNet,
      totalVat: row.totalVat,
      totalGross: row.totalGross,
      ksefId: row.ksefId,
      notes: row.notes,
      items: items.map((item) => ({
        description: item.description,
        quantity: parseFloat(item.quantity),
        unit: item.unit as InvoiceUnit,
        netPrice: item.netPrice,
        vatRate: item.vatRate as VatRate,
      })),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
