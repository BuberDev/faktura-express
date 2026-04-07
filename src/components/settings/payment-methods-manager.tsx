"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PaymentMethodEntity } from "@/core/domain/entities/payment-method-entity";
import {
  createPaymentMethodAction,
  updatePaymentMethodAction,
  deletePaymentMethodAction,
} from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodsManagerProps {
  methods: PaymentMethodEntity[];
}

const DEFAULT_METHODS = [
  { name: "Przelew bankowy", dueDays: 14 },
  { name: "Gotówka", dueDays: 0 },
  { name: "Karta płatnicza", dueDays: 0 },
  { name: "BLIK", dueDays: 0 },
  { name: "Przelew ekspresowy", dueDays: 1 },
];

export function PaymentMethodsManager({ methods }: PaymentMethodsManagerProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", dueDays: "14", isDefault: false });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Nazwa jest wymagana."); return; }
    setError(null);
    setIsPending(true);
    const result = await createPaymentMethodAction({
      name: form.name,
      dueDays: parseInt(form.dueDays) || 0,
      isDefault: form.isDefault,
    });
    setIsPending(false);
    if (result.error) { setError(result.error); return; }
    setShowForm(false);
    setForm({ name: "", dueDays: "14", isDefault: false });
    router.refresh();
  }

  async function handleQuickAdd(name: string, dueDays: number) {
    await createPaymentMethodAction({ name, dueDays, isDefault: false });
    router.refresh();
  }

  async function handleSetDefault(id: string) {
    await updatePaymentMethodAction(id, { isDefault: true });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Usunąć tę formę płatności?")) return;
    setDeletingId(id);
    await deletePaymentMethodAction(id);
    router.refresh();
    setDeletingId(null);
  }

  return (
    <div className="space-y-4">
      {methods.length === 0 && !showForm && (
        <Card className="space-y-4">
          <p className="text-black/60 dark:text-white/60 text-sm">Brak skonfigurowanych form płatności. Dodaj własną lub wybierz z gotowych:</p>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_METHODS.map((m) => (
              <button
                key={m.name}
                onClick={() => handleQuickAdd(m.name, m.dueDays)}
                className="rounded-full border border-gold-subtle px-3 py-1.5 text-sm hover:bg-gold/10 transition-colors"
              >
                + {m.name}
              </button>
            ))}
          </div>
          <Button onClick={() => setShowForm(true)} variant="outline" className="gap-2"><Plus className="h-4 w-4" />Dodaj własną</Button>
        </Card>
      )}

      {methods.map((method) => (
        <Card key={method.id} className={cn("flex items-center justify-between p-4", method.isDefault && "border-gold-subtle shadow-gold-sm")}>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{method.name}</span>
              {method.isDefault && (
                <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase text-gold-dark dark:text-gold-light">
                  Domyślna
                </span>
              )}
            </div>
            <div className="text-sm text-black/60 dark:text-white/60 mt-0.5">
              Termin: {method.dueDays === 0 ? "natychmiastowa" : `${method.dueDays} dni`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!method.isDefault && (
              <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={() => handleSetDefault(method.id)}>
                <Star className="h-3.5 w-3.5" />Ustaw domyślną
              </Button>
            )}
            <Button
              variant="outline" size="sm" className="h-8 w-8 p-0 border-red-500/30 text-red-500 hover:bg-red-500/10"
              onClick={() => handleDelete(method.id)} disabled={deletingId === method.id}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      ))}

      {methods.length > 0 && !showForm && (
        <div className="flex flex-col gap-3">
          <Button variant="outline" onClick={() => setShowForm(true)} className="gap-2 w-fit">
            <Plus className="h-4 w-4" />Dodaj formę płatności
          </Button>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_METHODS.filter(d => !methods.some(m => m.name === d.name)).map((m) => (
              <button key={m.name} onClick={() => handleQuickAdd(m.name, m.dueDays)} className="rounded-full border border-gold-subtle px-3 py-1.5 text-sm hover:bg-gold/10 transition-colors">
                + {m.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <Card className="space-y-4">
          <h3 className="font-display text-lg">Nowa forma płatności</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="pmName">Nazwa *</Label>
                <Input id="pmName" name="name" value={form.name} onChange={handleChange} placeholder="np. Przelew bankowy" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dueDays">Termin płatności (dni)</Label>
                <Input id="dueDays" name="dueDays" type="number" min="0" max="365" value={form.dueDays} onChange={handleChange} />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="pmDefault" name="isDefault" checked={form.isDefault} onChange={handleChange} className="h-4 w-4 accent-gold" />
                <Label htmlFor="pmDefault" className="cursor-pointer">Ustaw jako domyślną</Label>
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-3">
              <Button type="submit" disabled={isPending}>{isPending ? "Zapisywanie..." : "Zapisz"}</Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setError(null); }}>Anuluj</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
