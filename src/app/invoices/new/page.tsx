import { AppShell } from "@/components/layout/app-shell";
import { InvoiceWorkspace } from "@/components/invoice/invoice-workspace";

export default function NewInvoicePage() {
  return (
    <AppShell
      title="Nowa faktura"
      subtitle="Formularz i podgląd PDF działają równolegle w czasie rzeczywistym."
    >
      <InvoiceWorkspace />
    </AppShell>
  );
}
