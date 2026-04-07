import { eq, desc } from "drizzle-orm";
import type { ClientEntity, CreateClientInput, UpdateClientInput } from "@/core/domain/entities/client-entity";
import { db } from "@/infrastructure/supabase/db";
import { clients } from "@/core/domain/schema";

export class SupabaseClientRepository {
  async listByUser(userId: string): Promise<ClientEntity[]> {
    const results = await db.query.clients.findMany({
      where: eq(clients.userId, userId),
      orderBy: [desc(clients.createdAt)],
    });

    return results.map(this.mapToEntity);
  }

  async getByIdForUser(id: string, userId: string): Promise<ClientEntity | null> {
    const result = await db.query.clients.findFirst({
      where: (c, { and, eq: eq2 }) => and(eq2(c.id, id), eq2(c.userId, userId)),
    });

    return result ? this.mapToEntity(result) : null;
  }

  async create(input: CreateClientInput): Promise<string> {
    const [inserted] = await db
      .insert(clients)
      .values({
        userId: input.userId,
        name: input.name,
        nip: input.nip,
        address: input.address,
        email: input.email,
        phone: input.phone,
        bankAccount: input.bankAccount,
        notes: input.notes,
      })
      .returning({ id: clients.id });

    if (!inserted) throw new Error("Failed to create client");
    return inserted.id;
  }

  async update(id: string, input: UpdateClientInput): Promise<void> {
    await db
      .update(clients)
      .set({
        name: input.name,
        nip: input.nip,
        address: input.address,
        email: input.email,
        phone: input.phone,
        bankAccount: input.bankAccount,
        notes: input.notes,
        updatedAt: new Date(),
      })
      .where(eq(clients.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  private mapToEntity(row: typeof clients.$inferSelect): ClientEntity {
    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      nip: row.nip,
      address: row.address,
      email: row.email,
      phone: row.phone,
      bankAccount: row.bankAccount,
      notes: row.notes,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
