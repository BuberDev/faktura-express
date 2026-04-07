import { eq, desc } from "drizzle-orm";
import type { ProductEntity, CreateProductInput, UpdateProductInput } from "@/core/domain/entities/product-entity";
import type { VatRate, InvoiceUnit } from "@/core/domain/types/invoice";
import { db } from "@/infrastructure/supabase/db";
import { products } from "@/core/domain/schema";

export class SupabaseProductRepository {
  async listByUser(userId: string): Promise<ProductEntity[]> {
    const results = await db.query.products.findMany({
      where: eq(products.userId, userId),
      orderBy: [desc(products.createdAt)],
    });

    return results.map(this.mapToEntity);
  }

  async getByIdForUser(id: string, userId: string): Promise<ProductEntity | null> {
    const result = await db.query.products.findFirst({
      where: (p, { and, eq: eq2 }) => and(eq2(p.id, id), eq2(p.userId, userId)),
    });

    return result ? this.mapToEntity(result) : null;
  }

  async create(input: CreateProductInput): Promise<string> {
    const [inserted] = await db
      .insert(products)
      .values({
        userId: input.userId,
        name: input.name,
        description: input.description,
        unit: input.unit,
        netPrice: input.netPrice,
        vatRate: input.vatRate,
        sku: input.sku,
      })
      .returning({ id: products.id });

    if (!inserted) throw new Error("Failed to create product");
    return inserted.id;
  }

  async update(id: string, input: UpdateProductInput): Promise<void> {
    await db
      .update(products)
      .set({
        name: input.name,
        description: input.description,
        unit: input.unit,
        netPrice: input.netPrice,
        vatRate: input.vatRate,
        sku: input.sku,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  private mapToEntity(row: typeof products.$inferSelect): ProductEntity {
    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      description: row.description,
      unit: row.unit as InvoiceUnit,
      netPrice: row.netPrice,
      vatRate: row.vatRate as VatRate,
      sku: row.sku,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
