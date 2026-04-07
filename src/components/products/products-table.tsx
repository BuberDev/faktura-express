"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductEntity } from "@/core/domain/entities/product-entity";
import { deleteProductAction } from "@/app/actions/product";
import { formatPlnCurrency } from "@/core/use-cases/format-currency";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProductsTableProps {
  products: ProductEntity[];
}

const VAT_LABELS: Record<string, string> = {
  "23": "23%", "8": "8%", "5": "5%", "0": "0%", "zw": "zw.", "np": "np.",
};

export function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Czy na pewno chcesz usunąć ten produkt?")) return;
    setDeletingId(id);
    await deleteProductAction(id);
    router.refresh();
    setDeletingId(null);
  }

  return (
    <div className="overflow-x-auto rounded-md border border-[#E5E5E5] dark:border-[#262626]">
      <table className="w-full text-left text-sm">
        <thead className="bg-black/5 text-xs font-semibold uppercase tracking-wider dark:bg-white/5">
          <tr>
            <th className="px-4 py-3">Nazwa</th>
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">Cena netto</th>
            <th className="px-4 py-3">VAT</th>
            <th className="px-4 py-3">J.m.</th>
            <th className="px-4 py-3 text-right">Akcje</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#262626]">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
              <td className="px-4 py-4 font-medium">
                <div>{product.name}</div>
                {product.description && (
                  <div className="text-xs text-black/50 dark:text-white/50 mt-0.5">{product.description}</div>
                )}
              </td>
              <td className="px-4 py-4 text-black/60 dark:text-white/60 font-mono text-xs">{product.sku ?? "—"}</td>
              <td className="px-4 py-4 font-semibold">{formatPlnCurrency(product.netPrice)}</td>
              <td className="px-4 py-4">
                <span className="rounded-full bg-gold/10 px-2 py-0.5 text-xs font-bold text-gold-dark dark:text-gold-light">
                  {VAT_LABELS[product.vatRate] ?? product.vatRate}
                </span>
              </td>
              <td className="px-4 py-4 text-black/60 dark:text-white/60">{product.unit}</td>
              <td className="px-4 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/products/${product.id}/edit`}>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Edytuj">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-red-500/30 text-red-500 hover:bg-red-500/10"
                    title="Usuń"
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
