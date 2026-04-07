"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProfileEntity } from "@/infrastructure/supabase/queries/profile-repository";
import { updateCompanyDataAction } from "@/app/actions/profile";
import { fetchCompanyByNipAction } from "@/app/actions/gus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Search, CheckCircle2 } from "lucide-react";

interface CompanyDataFormProps {
  profile: ProfileEntity | null;
}

export function CompanyDataForm({ profile }: CompanyDataFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isGusPending, setIsGusPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    companyName: profile?.companyName ?? "",
    nip: profile?.nip ?? "",
    address: profile?.address ?? "",
    bankAccount: profile?.bankAccount ?? "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (success) setSuccess(false);
  }

  async function handleGusFetch() {
    if (!form.nip || form.nip.length < 10) {
      setError("Wprowadź poprawny NIP, aby pobrać dane z GUS.");
      return;
    }
    setError(null);
    setIsGusPending(true);
    const result = await fetchCompanyByNipAction(form.nip);
    setIsGusPending(false);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setForm((prev) => ({
        ...prev,
        companyName: result.data.name,
        address: result.data.address,
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setError(null);
    setIsPending(true);

    const result = await updateCompanyDataAction({
      id: profile.id,
      email: profile.email,
      ...form,
    });

    setIsPending(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-1.5 text-black/50 dark:text-white/50 text-xs italic">
              Wprowadź NIP swojej firmy, aby automatycznie pobrać dane z bazy GUS.
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nip">NIP Twojej firmy</Label>
              <div className="flex gap-2">
                <Input id="nip" name="nip" value={form.nip} onChange={handleChange} placeholder="1234567890" maxLength={10} />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="shrink-0 gap-2 border-gold/30 hover:border-gold hover:bg-gold/5"
                  onClick={handleGusFetch}
                  disabled={isGusPending}
                >
                  {isGusPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Pobierz
                </Button>
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="companyName">Pełna nazwa firmy</Label>
              <Input id="companyName" name="companyName" value={form.companyName} onChange={handleChange} placeholder="np. Twoja Firma S.C." />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="address">Adres (ulica, nr, kod pocztowy, miasto)</Label>
              <Input id="address" name="address" value={form.address} onChange={handleChange} placeholder="ul. Przykładowa 12, 00-001 Warszawa" />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="bankAccount">Domyślny numer konta bankowego</Label>
              <Input id="bankAccount" name="bankAccount" value={form.bankAccount} onChange={handleChange} placeholder="PL 00 0000 0000 0000 0000 0000 0000" />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Zapisz dane firmy
            </Button>
            {success && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium animate-in fade-in slide-in-from-left-2">
                <CheckCircle2 className="h-4 w-4" />
                Dane zostały zapisane poprawnie
              </div>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
}
