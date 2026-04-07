import { NextRequest, NextResponse } from "next/server";

import type { InvoiceEntity } from "@/core/domain/entities/invoice-entity";
import { calculateInvoiceTotals } from "@/core/use-cases/calculate-vat";
import { normalizeNip } from "@/core/use-cases/validate-nip";
import { SupabaseInvoiceRepository } from "@/infrastructure/supabase/queries/invoice-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { invoiceFormSchema } from "@/lib/schemas/invoice";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as unknown;
    const parsed = invoiceFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid invoice payload." },
        { status: 400 },
      );
    }

    const invoiceForm = parsed.data;
    const totals = calculateInvoiceTotals(invoiceForm.items);

    const invoiceEntity: InvoiceEntity = {
      id: "",
      userId: user.id,
      number: invoiceForm.number,
      type: invoiceForm.type,
      issueDate: invoiceForm.issueDate,
      saleDate: invoiceForm.saleDate,
      dueDate: invoiceForm.dueDate,
      status: invoiceForm.status,
      issuer: {
        name: invoiceForm.issuerName,
        nip: normalizeNip(invoiceForm.issuerNip),
        address: invoiceForm.issuerAddress,
      },
      client: {
        name: invoiceForm.clientName,
        nip: normalizeNip(invoiceForm.clientNip),
        address: invoiceForm.clientAddress,
      },
      items: invoiceForm.items,
      totalNet: totals.net,
      totalVat: totals.vat,
      totalGross: totals.gross,
      isDraft: false,
    };

    const repository = new SupabaseInvoiceRepository();
    const invoiceId = await repository.create(invoiceEntity);

    return NextResponse.json({ id: invoiceId }, { status: 201 });
  } catch (error) {
    console.error(" [Invoice Creation Error] ", error);
    return NextResponse.json(
      { 
        error: "Nie udało się wystawić faktury.", 
        details: error instanceof Error ? error.message : "Błąd serwera" 
      }, 
      { status: 500 }
    );
  }
}
