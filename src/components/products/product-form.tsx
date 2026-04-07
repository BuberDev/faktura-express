"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductEntity } from "@/core/domain/entities/product-entity";
import type { VatRate, InvoiceUnit } from "@/core/domain/types/invoice";
import { createProductAction, updateProductAction } from "@/app/actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const VAT_OPTIONS: { value: VatRate; label: string }[] = [
  { value: "23", label: "23%" },
  { value: "8", label: "8%" },
  { value: "5", label: "5%" },
  { value: "0", label: "0%" },
  { value: "zw", label: "zw." },
  { value: "np", label: "np." },
];

const UNIT_OPTIONS: { value: InvoiceUnit; label: string }[] = [
  { value: "szt", label: "szt." },
  { value: "godz", label: "godz." },
  { value: "km", label: "km" },
];

interface ProductFormProps {
  mode: "create" | "edit";
  product?: ProductEntity;
}

export function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    sku: product?.sku ?? "",
    netPrice: product?.netPrice ?? "",
    vatRate: product?.vatRate ?? "23",
    unit: product?.unit ?? "szt",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Nazwa jest wymagana."); return; }
    if (!form.netPrice || isNaN(parseFloat(form.netPrice))) { setError("Podaj prawidłową cenę netto."); return; }
    setError(null);
    setIsPending(true);

    const payload = {
      name: form.name,
      description: form.description || null,
      sku: form.sku || null,
      netPrice: parseFloat(form.netPrice).toFixed(2),
      vatRate: form.vatRate as VatRate,
      unit: form.unit as InvoiceUnit,
    };

    const result =
      mode === "create"
        ? await createProductAction(payload)
        : await updateProductAction(product!.id, payload);

    setIsPending(false);
    if (result.error) { setError(result.error); return; }
    router.push("/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Link href="/products" className="flex items-center gap-2 text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Wróć do katalogu
      </Link>

      <Card className="space-y-5">
        <h2 className="font-display text-lg">Dane produktu</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="name">Nazwa *</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="np. Usługa projektowania graficznego" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sku">SKU / kod produktu</Label>
            <Input id="sku" name="sku" value={form.sku} onChange={handleChange} placeholder="np. USL-001" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="unit">Jednostka miary *</Label>
            <select
              id="unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full h-10 rounded-md border border-[#E5E5E5] bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 dark:border-[#262626]"
            >
              {UNIT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="netPrice">Cena netto (PLN) *</Label>
            <Input id="netPrice" name="netPrice" type="number" step="0.01" min="0" value={form.netPrice} onChange={handleChange} placeholder="0.00" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vatRate">Stawka VAT *</Label>
            <select
              id="vatRate"
              name="vatRate"
              value={form.vatRate}
              onChange={handleChange}
              className="w-full h-10 rounded-md border border-[#E5E5E5] bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 dark:border-[#262626]"
            >
              {VAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="description">Opis</Label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Opcjonalny opis produktu lub usługi..."
              rows={3}
              className="w-full rounded-md border border-[#E5E5E5] bg-transparent px-3 py-2 text-sm placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold dark:border-[#262626] dark:placeholder:text-white/40 resize-none"
            />
          </div>
        </div>
      </Card>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-3">
        <Link href="/products">
          <Button type="button" variant="outline">Anuluj</Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Zapisywanie..." : mode === "create" ? "Dodaj produkt" : "Zapisz zmiany"}
        </Button>
      </div>
    </form>
  );
}
