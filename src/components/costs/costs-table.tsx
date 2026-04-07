"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CostEntity, CostStatus } from "@/core/domain/entities/cost-entity";
import { deleteCostAction, updateCostStatusAction } from "@/app/actions/cost";
import { formatPlnCurrency } from "@/core/use-cases/format-currency";
import { Trash2, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CostsTableProps {
  costs: CostEntity[];
}

export function CostsTable({ costs }: CostsTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Czy na pewno chcesz usunąć ten koszt?")) return;
    setLoadingId(id);
    await deleteCostAction(id);
    router.refresh();
    setLoadingId(null);
  }

  async function handleToggleStatus(id: string, current: CostStatus) {
    setLoadingId(id);
    await updateCostStatusAction(id, current === "paid" ? "unpaid" : "paid");
    router.refresh();
    setLoadingId(null);
  }

  return (
    <div className="overflow-x-auto rounded-md border border-[#E5E5E5] dark:border-[#262626]">
      <table className="w-full text-left text-sm">
        <thead className="bg-black/5 text-xs font-semibold uppercase tracking-wider dark:bg-white/5">
          <tr>
            <th className="px-4 py-3">Numer</th>
            <th className="px-4 py-3">Dostawca</th>
            <th className="px-4 py-3">Data</th>
            <th className="px-4 py-3">Termin</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Brutto</th>
            <th className="px-4 py-3 text-right">Akcje</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#262626]">
          {costs.map((cost) => (
            <tr key={cost.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
              <td className="px-4 py-4 font-medium font-mono text-xs">{cost.number}</td>
              <td className="px-4 py-4">
                <div className="font-medium">{cost.vendorName}</div>
                {cost.vendorNip && <div className="text-xs text-black/50 dark:text-white/50">NIP: {cost.vendorNip}</div>}
              </td>
              <td className="px-4 py-4 text-black/60 dark:text-white/60">{cost.issueDate}</td>
              <td className="px-4 py-4 text-black/60 dark:text-white/60">{cost.dueDate}</td>
              <td className="px-4 py-4">
                <button
                  onClick={() => handleToggleStatus(cost.id, cost.status)}
                  disabled={loadingId === cost.id}
                  className={cn(
                    "rounded-full px-2 py-1 text-[10px] font-bold uppercase transition-colors cursor-pointer",
                    cost.status === "paid"
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20"
                      : "bg-gold/10 text-gold-dark dark:text-gold-light hover:bg-gold/20"
                  )}
                  title="Kliknij, aby zmienić status"
                >
                  {cost.status === "paid" ? "Opłacona" : "Nieopłacona"}
                </button>
              </td>
              <td className="px-4 py-4 font-semibold">{formatPlnCurrency(cost.totalGross)}</td>
              <td className="px-4 py-4 text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-red-500/30 text-red-500 hover:bg-red-500/10"
                  onClick={() => handleDelete(cost.id)}
                  disabled={loadingId === cost.id}
                  title="Usuń"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
