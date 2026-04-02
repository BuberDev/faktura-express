"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { InvoiceEntity } from "@/core/domain/entities/invoice-entity";
import { calculateInvoiceTotals } from "@/core/use-cases/calculate-vat";
import { InvoicePdfService } from "@/infrastructure/pdf/invoice-pdf-service";
import type { InvoiceFormValues } from "@/lib/schemas/invoice";

interface InvoicePdfDownloadButtonProps {
  values: InvoiceFormValues;
}

export function InvoicePdfDownloadButton({ values }: InvoicePdfDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function downloadPdf(): Promise<void> {
    setIsLoading(true);

    const totals = calculateInvoiceTotals(values.items);
    const invoice: InvoiceEntity = {
      id: "preview-invoice",
      userId: "preview-user",
      number: values.number,
      type: values.type,
      issueDate: values.issueDate,
      saleDate: values.saleDate,
      dueDate: values.dueDate,
      status: values.status,
      issuer: {
        name: values.issuerName,
        nip: values.issuerNip,
        address: values.issuerAddress,
      },
      client: {
        name: values.clientName,
        nip: values.clientNip,
        address: values.clientAddress,
      },
      items: values.items,
      totalNet: totals.net,
      totalVat: totals.vat,
      totalGross: totals.gross,
    };

    const service = new InvoicePdfService();
    await service.download(invoice, `${values.number || "faktura"}.pdf`);

    setIsLoading(false);
  }

  return (
    <Button className="w-full" variant="outline" onClick={downloadPdf} disabled={isLoading}>
      {isLoading ? "Generowanie PDF..." : "Pobierz PDF"}
    </Button>
  );
}
