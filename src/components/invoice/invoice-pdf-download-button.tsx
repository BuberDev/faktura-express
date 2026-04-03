"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { InvoiceEntity } from "@/core/domain/entities/invoice-entity";
import { calculateInvoiceTotals } from "@/core/use-cases/calculate-vat";
import { InvoicePdfService } from "@/infrastructure/pdf/invoice-pdf-service";
import type { InvoiceFormValues } from "@/lib/schemas/invoice";

interface InvoicePdfDownloadButtonProps {
  invoice: InvoiceEntity;
  variant?: "outline" | "primary" | "gold";
  className?: string;
}

export function InvoicePdfDownloadButton({ 
  invoice, 
  variant = "outline",
  className = "w-full"
}: InvoicePdfDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function downloadPdf(): Promise<void> {
    setIsLoading(true);
    try {
      const service = new InvoicePdfService();
      await service.download(invoice, `${invoice.number || "faktura"}.pdf`);
    } catch (err) {
      console.error("PDF Download failed:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "gold":
        return "bg-gold-metallic text-black hover:opacity-90 border-none shadow-gold-sm hover:shadow-gold-md transition-all";
      default:
        return "";
    }
  };

  return (
    <Button 
      className={`${className} ${getVariantStyles()}`}
      variant={variant === "gold" ? "primary" : variant}
      onClick={downloadPdf} 
      disabled={isLoading}
    >
      <lucide.Download className="mr-2 h-4 w-4" />
      {isLoading ? "Generowanie..." : "Pobierz PDF"}
    </Button>
  );
}

import * as lucide from "lucide-react";
