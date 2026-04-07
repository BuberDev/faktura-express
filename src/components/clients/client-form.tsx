"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ClientEntity } from "@/core/domain/entities/client-entity";
import { createClientAction, updateClientAction } from "@/app/actions/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { fetchCompanyByNipAction } from "@/app/actions/gus";
import { Search, Loader2 } from "lucide-react";

interface ClientFormProps {
  mode: "create" | "edit";
  client?: ClientEntity;
}

export function ClientForm({ mode, client }: ClientFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isGusPending, setIsGusPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: client?.name ?? "",
    nip: client?.nip ?? "",
    address: client?.address ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? "",
    bankAccount: client?.bankAccount ?? "",
    notes: client?.notes ?? "",
  });

  async function handleGusFetch() {
    if (!form.nip || form.nip.length < 10) {
      setError("Wprowadź poprawny NIP (10 cyfr), aby pobrać dane z GUS.");
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
        name: result.data.name,
        address: result.data.address,
      }));
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Nazwa kontrahenta jest wymagana.");
      return;
    }
    setError(null);
    setIsPending(true);

    const result =
      mode === "create"
        ? await createClientAction({
            name: form.name,
            nip: form.nip || null,
            address: form.address || null,
            email: form.email || null,
            phone: form.phone || null,
            bankAccount: form.bankAccount || null,
            notes: form.notes || null,
          })
        : await updateClientAction(client!.id, {
            name: form.name,
            nip: form.nip || null,
            address: form.address || null,
            email: form.email || null,
            phone: form.phone || null,
            bankAccount: form.bankAccount || null,
            notes: form.notes || null,
          });

    setIsPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/clients");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Link href="/clients" className="flex items-center gap-2 text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Wróć do listy
      </Link>

      <Card className="space-y-5">
        <h2 className="font-display text-lg">Dane podstawowe</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="name">Nazwa firmy / imię i nazwisko *</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="np. ABC Sp. z o.o." required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nip">NIP</Label>
            <div className="flex gap-2">
              <Input id="nip" name="nip" value={form.nip} onChange={handleChange} placeholder="np. 1234567890" maxLength={10} />
              <Button 
                type="button" 
                variant="outline" 
                className="shrink-0 gap-2 border-gold/30 hover:border-gold hover:bg-gold/5"
                onClick={handleGusFetch}
                disabled={isGusPending}
              >
                {isGusPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Pobierz z GUS
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="kontakt@firma.pl" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+48 123 456 789" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bankAccount">Numer rachunku bankowego</Label>
            <Input id="bankAccount" name="bankAccount" value={form.bankAccount} onChange={handleChange} placeholder="PL00 0000 0000 0000 0000 0000 0000" />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="address">Adres</Label>
            <Input id="address" name="address" value={form.address} onChange={handleChange} placeholder="ul. Przykładowa 1, 00-000 Warszawa" />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="notes">Notatki</Label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Dodatkowe informacje o kontrahencie..."
              rows={3}
              className="w-full rounded-md border border-[#E5E5E5] bg-transparent px-3 py-2 text-sm placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold dark:border-[#262626] dark:placeholder:text-white/40 resize-none"
            />
          </div>
        </div>
      </Card>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-3">
        <Link href="/clients">
          <Button type="button" variant="outline">Anuluj</Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Zapisywanie..." : mode === "create" ? "Dodaj kontrahenta" : "Zapisz zmiany"}
        </Button>
      </div>
    </form>
  );
}
