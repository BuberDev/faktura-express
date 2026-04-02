import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CompanyDataSettingsPage() {
  return (
    <AppShell title="Dane firmy" subtitle="Informacje domyślnie wstawiane na każdą fakturę.">
      <Card className="max-w-2xl space-y-4">
        <div className="space-y-2">
          <label htmlFor="companyName" className="text-sm font-medium">
            Nazwa firmy
          </label>
          <Input id="companyName" placeholder="Faktura Express Sp. z o.o." />
        </div>
        <div className="space-y-2">
          <label htmlFor="nip" className="text-sm font-medium">
            NIP
          </label>
          <Input id="nip" placeholder="5252739428" />
        </div>
        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium">
            Adres
          </label>
          <Input id="address" placeholder="ul. Złota 1, 00-001 Warszawa" />
        </div>
        <div className="space-y-2">
          <label htmlFor="bankAccount" className="text-sm font-medium">
            Numer konta
          </label>
          <Input id="bankAccount" placeholder="00 0000 0000 0000 0000 0000 0000" />
        </div>
        <Button>Zapisz dane firmy</Button>
      </Card>
    </AppShell>
  );
}
