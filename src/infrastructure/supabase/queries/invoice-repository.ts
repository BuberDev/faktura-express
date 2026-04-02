import type { InvoiceEntity } from "@/core/domain/entities/invoice-entity";

import type { SupabaseClient } from "@supabase/supabase-js";

interface InvoiceRow {
  id: string;
  user_id: string;
  number: string;
  type: "VAT" | "Proforma" | "Correction";
  issue_date: string;
  sale_date: string;
  due_date: string;
  status: "unpaid" | "paid";
  total_net: string;
  total_vat: string;
  total_gross: string;
}

interface InvoiceItemRow {
  description: string;
  quantity: number;
  unit: "szt" | "godz" | "km";
  net_price: string;
  vat_rate: "23" | "8" | "5" | "0" | "zw" | "np";
}

function mapInvoiceToEntity(row: InvoiceRow, items: InvoiceItemRow[]): InvoiceEntity {
  return {
    id: row.id,
    userId: row.user_id,
    number: row.number,
    type: row.type,
    issueDate: row.issue_date,
    saleDate: row.sale_date,
    dueDate: row.due_date,
    status: row.status,
    issuer: {
      name: "",
      nip: "",
      address: "",
    },
    client: {
      name: "",
      nip: "",
      address: "",
    },
    items: items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      netPrice: item.net_price,
      vatRate: item.vat_rate,
    })),
    totalNet: row.total_net,
    totalVat: row.total_vat,
    totalGross: row.total_gross,
  };
}

export class SupabaseInvoiceRepository {
  constructor(private readonly client: SupabaseClient) {}

  async listByUser(userId: string): Promise<InvoiceEntity[]> {
    const { data, error } = await this.client
      .from("invoices")
      .select("*")
      .eq("user_id", userId)
      .order("issue_date", { ascending: false });

    if (error) {
      throw new Error(`Invoice list query failed: ${error.message}`);
    }

    const invoiceRows = (data ?? []) as InvoiceRow[];

    return invoiceRows.map((invoice) => mapInvoiceToEntity(invoice, []));
  }

  async getByIdForUser(invoiceId: string, userId: string): Promise<InvoiceEntity | null> {
    const { data, error } = await this.client
      .from("invoices")
      .select("*, invoice_items(*)")
      .eq("id", invoiceId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Invoice detail query failed: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const invoiceRow = data as InvoiceRow & { invoice_items: InvoiceItemRow[] };

    return mapInvoiceToEntity(invoiceRow, invoiceRow.invoice_items ?? []);
  }

  async create(invoice: InvoiceEntity): Promise<string> {
    const { data: invoiceInsert, error: invoiceError } = await this.client
      .from("invoices")
      .insert({
        user_id: invoice.userId,
        number: invoice.number,
        type: invoice.type,
        issue_date: invoice.issueDate,
        sale_date: invoice.saleDate,
        due_date: invoice.dueDate,
        status: invoice.status,
        total_net: invoice.totalNet,
        total_vat: invoice.totalVat,
        total_gross: invoice.totalGross,
      })
      .select("id")
      .single();

    if (invoiceError || !invoiceInsert) {
      throw new Error(`Invoice create query failed: ${invoiceError?.message}`);
    }

    const invoiceId = invoiceInsert.id as string;

    const { error: itemsError } = await this.client.from("invoice_items").insert(
      invoice.items.map((item) => ({
        invoice_id: invoiceId,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        net_price: item.netPrice,
        vat_rate: item.vatRate,
      })),
    );

    if (itemsError) {
      throw new Error(`Invoice item create query failed: ${itemsError.message}`);
    }

    return invoiceId;
  }
}
