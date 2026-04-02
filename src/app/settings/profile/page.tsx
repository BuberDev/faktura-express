import { AccountLinkingCard } from "@/components/auth/account-linking-card";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ProfileSettingsPage() {
  return (
    <AppShell title="Ustawienia profilu" subtitle="Dane konta właściciela i preferencje logowania.">
      <Card className="max-w-2xl space-y-4">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium">
            Imię i nazwisko
          </label>
          <Input id="fullName" placeholder="Jan Kowalski" />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Adres e-mail
          </label>
          <Input id="email" type="email" placeholder="jan@firma.pl" />
        </div>
        <Button>Zapisz zmiany</Button>
      </Card>
      <div className="mt-4">
        <AccountLinkingCard />
      </div>
    </AppShell>
  );
}
