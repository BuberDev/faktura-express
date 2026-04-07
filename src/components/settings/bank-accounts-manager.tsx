"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BankAccountEntity } from "@/core/domain/entities/bank-account-entity";
import {
  createBankAccountAction,
  updateBankAccountAction,
  deleteBankAccountAction,
} from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Star, StarOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface BankAccountsManagerProps {
  accounts: BankAccountEntity[];
}

function emptyForm() {
  return { name: "", iban: "", bankName: "", currency: "PLN", isDefault: false };
}

export function BankAccountsManager({ accounts }: BankAccountsManagerProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.iban.trim()) {
      setError("Nazwa i numer IBAN są wymagane.");
      return;
    }
    setError(null);
    setIsPending(true);
    const result = await createBankAccountAction({
      name: form.name,
      iban: form.iban.replace(/\s/g, ""),
      bankName: form.bankName || null,
      currency: form.currency,
      isDefault: form.isDefault,
    });
    setIsPending(false);
    if (result.error) { setError(result.error); return; }
    setShowForm(false);
    setForm(emptyForm());
    router.refresh();
  }

  async function handleSetDefault(id: string) {
    await updateBankAccountAction(id, { isDefault: true });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Czy na pewno usunąć ten rachunek?")) return;
    setDeletingId(id);
    await deleteBankAccountAction(id);
    router.refresh();
    setDeletingId(null);
  }

  return (
    <div className="space-y-4">
      {accounts.length === 0 && !showForm && (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-black/60 dark:text-white/60 mb-4">Nie masz jeszcze zapisanych rachunków bankowych.</p>
          <Button onClick={() => setShowForm(true)} className="gap-2"><Plus className="h-4 w-4" />Dodaj rachunek</Button>
        </Card>
      )}

      {accounts.map((account) => (
        <Card key={account.id} className={cn("flex items-center justify-between p-4", account.isDefault && "border-gold-subtle shadow-gold-sm")}>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{account.name}</span>
              {account.isDefault && (
                <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase text-gold-dark dark:text-gold-light">
                  Domyślny
                </span>
              )}
            </div>
            <div className="text-sm text-black/60 dark:text-white/60 font-mono mt-0.5">{account.iban}</div>
            {account.bankName && <div className="text-xs text-black/50 dark:text-white/50">{account.bankName} · {account.currency}</div>}
          </div>
          <div className="flex items-center gap-2">
            {!account.isDefault && (
              <Button
                variant="outline" size="sm" className="gap-1.5 h-8"
                onClick={() => handleSetDefault(account.id)}
                title="Ustaw jako domyślny"
              >
                <Star className="h-3.5 w-3.5" />
                Ustaw domyślny
              </Button>
            )}
            <Button
              variant="outline" size="sm" className="h-8 w-8 p-0 border-red-500/30 text-red-500 hover:bg-red-500/10"
              onClick={() => handleDelete(account.id)}
              disabled={deletingId === account.id}
              title="Usuń"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      ))}

      {!showForm && accounts.length > 0 && (
        <Button variant="outline" onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />Dodaj kolejny rachunek
        </Button>
      )}

      {showForm && (
        <Card className="space-y-4">
          <h3 className="font-display text-lg">Nowy rachunek bankowy</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nazwa rachunku *</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="np. Konto firmowe PLN" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="currency">Waluta</Label>
                <select id="currency" name="currency" value={form.currency} onChange={handleChange} className="w-full h-10 rounded-md border border-[#E5E5E5] bg-transparent px-3 text-sm dark:border-[#262626]">
                  <option value="PLN">PLN</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="iban">Numer IBAN / rachunku *</Label>
                <Input id="iban" name="iban" value={form.iban} onChange={handleChange} placeholder="PL00 0000 0000 0000 0000 0000 0000" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bankName">Nazwa banku</Label>
                <Input id="bankName" name="bankName" value={form.bankName} onChange={handleChange} placeholder="np. PKO Bank Polski" />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" id="isDefault" name="isDefault" checked={form.isDefault} onChange={handleChange} className="h-4 w-4 accent-gold" />
                <Label htmlFor="isDefault" className="cursor-pointer">Ustaw jako domyślny</Label>
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-3">
              <Button type="submit" disabled={isPending}>{isPending ? "Zapisywanie..." : "Zapisz rachunek"}</Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm(emptyForm()); setError(null); }}>Anuluj</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
