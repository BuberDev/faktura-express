"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CostType } from "@/core/domain/entities/cost-entity";
import type { VatRate, InvoiceUnit } from "@/core/domain/types/invoice";
import { createCostAction } from "@/app/actions/cost";
import { calculateInvoiceTotals } from "@/core/use-cases/calculate-vat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

const VAT_OPTIONS: { value: VatRate; label: string }[] = [
  { value: "23", label: "23%" }, { value: "8", label: "8%" }, { value: "5", label: "5%" },
  { value: "0", label: "0%" }, { value: "zw", label: "zw." }, { value: "np", label: "np." },
];

interface CostFormProps {
  type: CostType;
  backHref: string;
  typeLabel: string;
}

interface Item { description: string; quantity: string; unit: InvoiceUnit; netPrice: string; vatRate: VatRate; }

const emptyItem = (): Item => ({ description: "", quantity: "1", unit: "szt", netPrice: "", vatRate: "23" });

export function CostForm({ type, backHref, typeLabel }: CostFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([emptyItem()]);

  const [form, setForm] = useState({
    number: "",
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    vendorName: "",
    vendorNip: "",
    vendorAddress: "",
    ksefId: "",
    notes: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  }

  function handleItemChange(i: number, field: keyof Item, value: string) {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  }

  function addItem() { setItems(p => [...p, emptyItem()]); }
  function removeItem(i: number) { setItems(p => p.filter((_, idx) => idx !== i)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.vendorName.trim()) { setError("Nazwa dostawcy jest wymagana."); return; }
    if (!form.number.trim()) { setError("Numer dokumentu jest wymagany."); return; }
    if (items.some(i => !i.description || !i.netPrice)) { setError("Uzupełnij wszystkie pozycje."); return; }
    setError(null);
    setIsPending(true);

    const parsedItems = items.map(i => ({
      description: i.description,
      quantity: parseFloat(i.quantity) || 1,
      unit: i.unit,
      netPrice: parseFloat(i.netPrice).toFixed(2),
      vatRate: i.vatRate,
    }));

    const totals = calculateInvoiceTotals(parsedItems);

    const result = await createCostAction({
      number: form.number,
      type,
      issueDate: form.issueDate,
      dueDate: form.dueDate || form.issueDate,
      status: "unpaid",
      vendorName: form.vendorName,
      vendorNip: form.vendorNip || null,
      vendorAddress: form.vendorAddress || null,
      totalNet: totals.net,
      totalVat: totals.vat,
      totalGross: totals.gross,
      ksefId: form.ksefId || null,
      notes: form.notes || null,
      items: parsedItems,
    });

    setIsPending(false);
    if (result.error) { setError(result.error); return; }
    router.push(backHref);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Link href={backHref} className="flex items-center gap-2 text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" />Wróć
      </Link>

      <Card className="space-y-5">
        <h2 className="font-display text-lg">Dane dokumentu — {typeLabel}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="number">Numer dokumentu *</Label>
            <Input id="number" name="number" value={form.number} onChange={handleChange} placeholder="FV/2024/001" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="issueDate">Data wystawienia *</Label>
            <Input id="issueDate" name="issueDate" type="date" value={form.issueDate} onChange={handleChange} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dueDate">Termin płatności</Label>
            <Input id="dueDate" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
          </div>
          {type === "ksef" && (
            <div className="space-y-1.5">
              <Label htmlFor="ksefId">Numer KSeF</Label>
              <Input id="ksefId" name="ksefId" value={form.ksefId} onChange={handleChange} placeholder="np. 1234/2024" />
            </div>
          )}
        </div>
      </Card>

      <Card className="space-y-5">
        <h2 className="font-display text-lg">Dane dostawcy</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="vendorName">Nazwa dostawcy *</Label>
            <Input id="vendorName" name="vendorName" value={form.vendorName} onChange={handleChange} placeholder="Nazwa firmy dostawcy" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="vendorNip">NIP dostawcy</Label>
            <Input id="vendorNip" name="vendorNip" value={form.vendorNip} onChange={handleChange} placeholder="1234567890" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="vendorAddress">Adres dostawcy</Label>
            <Input id="vendorAddress" name="vendorAddress" value={form.vendorAddress} onChange={handleChange} placeholder="ul. Przykładowa 1, Warszawa" />
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display text-lg">Pozycje</h2>
        {items.map((item, i) => (
          <div key={i} className="grid gap-3 sm:grid-cols-6 items-end border border-[#E5E5E5] dark:border-[#262626] rounded-md p-3">
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Opis *</Label>
              <Input value={item.description} onChange={e => handleItemChange(i, "description", e.target.value)} placeholder="Nazwa usługi/towaru" required />
            </div>
            <div className="space-y-1.5">
              <Label>Ilość</Label>
              <Input type="number" min="0.01" step="0.01" value={item.quantity} onChange={e => handleItemChange(i, "quantity", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Cena netto *</Label>
              <Input type="number" min="0" step="0.01" value={item.netPrice} onChange={e => handleItemChange(i, "netPrice", e.target.value)} placeholder="0.00" required />
            </div>
            <div className="space-y-1.5">
              <Label>VAT</Label>
              <select value={item.vatRate} onChange={e => handleItemChange(i, "vatRate", e.target.value as VatRate)} className="w-full h-10 rounded-md border border-[#E5E5E5] bg-transparent px-3 text-sm dark:border-[#262626]">
                {VAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              {items.length > 1 && (
                <Button type="button" variant="outline" size="sm" className="h-10 w-10 p-0 border-red-500/30 text-red-500 hover:bg-red-500/10" onClick={() => removeItem(i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-2">
          <Plus className="h-4 w-4" /> Dodaj pozycję
        </Button>
      </Card>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex justify-end gap-3">
        <Link href={backHref}><Button type="button" variant="outline">Anuluj</Button></Link>
        <Button type="submit" disabled={isPending}>{isPending ? "Zapisywanie..." : "Zapisz dokument"}</Button>
      </div>
    </form>
  );
}
