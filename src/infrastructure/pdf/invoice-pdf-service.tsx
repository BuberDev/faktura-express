import { pdf } from "@react-pdf/renderer";

import type { InvoiceEntity } from "@/core/domain/entities/invoice-entity";

import { InvoicePdfTemplate } from "./invoice-pdf-template";

export class InvoicePdfService {
  async generateBlob(invoice: InvoiceEntity): Promise<Blob> {
    return pdf(<InvoicePdfTemplate invoice={invoice} />).toBlob();
  }

  async download(invoice: InvoiceEntity, filename: string): Promise<void> {
    const blob = await this.generateBlob(invoice);
    const fileUrl = window.URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = fileUrl;
    anchor.download = filename;
    anchor.click();

    window.URL.revokeObjectURL(fileUrl);
  }
}
