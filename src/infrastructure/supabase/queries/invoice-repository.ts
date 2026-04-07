import { eq, desc, and } from "drizzle-orm";
import type { InvoiceEntity } from "@/core/domain/entities/invoice-entity";
import { db } from "@/infrastructure/supabase/db";
import { invoices, invoiceItems } from "@/core/domain/schema";

export class SupabaseInvoiceRepository {
  async listByUser(userId: string): Promise<InvoiceEntity[]> {
    const results = await db.query.invoices.findMany({
      where: eq(invoices.userId, userId),
      orderBy: [desc(invoices.issueDate)],
      with: {
        // Items are usually not needed in the list view, but if needed, they can be included
      }
    });

    return results.map((row) => this.mapToEntity(row, []));
  }

  async getByIdForUser(invoiceId: string, userId: string): Promise<InvoiceEntity | null> {
    const result = await db.query.invoices.findFirst({
      where: and(eq(invoices.id, invoiceId), eq(invoices.userId, userId)),
      with: {
        invoiceItems: true
      }
    });

    if (!result) return null;

    return this.mapToEntity(result, (result as any).invoiceItems ?? []);
  }

  async create(invoice: InvoiceEntity): Promise<string> {
    return await db.transaction(async (tx) => {
      const [insertedInvoice] = await tx.insert(invoices).values({
        userId: invoice.userId,
        number: invoice.number,
        type: invoice.type,
        issueDate: invoice.issueDate,
        saleDate: invoice.saleDate,
        dueDate: invoice.dueDate,
        status: invoice.status,
        issuerName: invoice.issuer.name,
        issuerNip: invoice.issuer.nip,
        issuerAddress: invoice.issuer.address,
        clientName: invoice.client.name,
        clientNip: invoice.client.nip,
        clientAddress: invoice.client.address,
        totalNet: invoice.totalNet,
        totalVat: invoice.totalVat,
        totalGross: invoice.totalGross,
        isDraft: invoice.isDraft,
        ksefStatus: invoice.ksefStatus || "none",
        ksefId: invoice.ksefId,
        upoUrl: invoice.upoUrl,
      }).returning({ id: invoices.id });

      if (!insertedInvoice) {
        throw new Error("Failed to insert invoice");
      }

      const invoiceId = insertedInvoice.id;

      if (invoice.items.length > 0) {
        await tx.insert(invoiceItems).values(
          invoice.items.map((item) => ({
            invoiceId,
            description: item.description,
            quantity: item.quantity.toString(), // Drizzle numeric is string-based
            unit: item.unit,
            netPrice: item.netPrice,
            vatRate: item.vatRate,
          }))
        );
      }

      return invoiceId;
    });
  }

  async update(id: string, invoice: InvoiceEntity): Promise<void> {
    await db.transaction(async (tx) => {
      // Update the invoice header
      await tx.update(invoices)
        .set({
          number: invoice.number,
          type: invoice.type,
          issueDate: invoice.issueDate,
          saleDate: invoice.saleDate,
          dueDate: invoice.dueDate,
          status: invoice.status,
          issuerName: invoice.issuer.name,
          issuerNip: invoice.issuer.nip,
          issuerAddress: invoice.issuer.address,
          clientName: invoice.client.name,
          clientNip: invoice.client.nip,
          clientAddress: invoice.client.address,
          totalNet: invoice.totalNet,
          totalVat: invoice.totalVat,
          totalGross: invoice.totalGross,
          isDraft: invoice.isDraft,
          ksefStatus: invoice.ksefStatus,
          ksefId: invoice.ksefId,
          upoUrl: invoice.upoUrl,
        })
        .where(eq(invoices.id, id));

      // Remove existing items and re-insert (simpler than syncing)
      await tx.delete(invoiceItems).where(eq(invoiceItems.invoiceId, id));

      if (invoice.items.length > 0) {
        await tx.insert(invoiceItems).values(
          invoice.items.map((item) => ({
            invoiceId: id,
            description: item.description,
            quantity: item.quantity.toString(),
            unit: item.unit,
            netPrice: item.netPrice,
            vatRate: item.vatRate,
          }))
        );
      }
    });
  }

  async delete(id: string): Promise<void> {
    await db.transaction(async (tx) => {
      // First delete items to satisfy foreign key constraints (or cascade will handle it, but explicit is safer)
      await tx.delete(invoiceItems).where(eq(invoiceItems.invoiceId, id));
      // Delete the invoice itself
      await tx.delete(invoices).where(eq(invoices.id, id));
    });
  }

  private mapToEntity(row: any, items: any[]): InvoiceEntity {
    return {
      id: row.id,
      userId: row.userId,
      number: row.number,
      type: row.type as any,
      issueDate: row.issueDate,
      saleDate: row.saleDate,
      dueDate: row.dueDate,
      status: row.status as any,
      issuer: {
        name: row.issuerName,
        nip: row.issuerNip,
        address: row.issuerAddress,
      },
      client: {
        name: row.clientName,
        nip: row.clientNip,
        address: row.clientAddress,
      },
      items: items.map((item) => ({
        description: item.description,
        quantity: parseFloat(item.quantity),
        unit: item.unit as any,
        netPrice: item.netPrice,
        vatRate: item.vatRate as any,
      })),
      totalNet: row.totalNet,
      totalVat: row.totalVat,
      totalGross: row.totalGross,
      isDraft: row.isDraft,
      ksefStatus: row.ksefStatus,
      ksefId: row.ksefId,
      upoUrl: row.upoUrl,
    };
  }
}
