"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ClientEntity } from "@/core/domain/entities/client-entity";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteClientAction as _delete } from "@/app/actions/client";

interface ClientsTableProps {
  clients: ClientEntity[];
}

export function ClientsTable({ clients }: ClientsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Czy na pewno chcesz usunąć tego kontrahenta?")) return;
    setDeletingId(id);
    await _delete(id);
    router.refresh();
    setDeletingId(null);
  }

  return (
    <div className="overflow-x-auto rounded-md border border-[#E5E5E5] dark:border-[#262626]">
      <table className="w-full text-left text-sm">
        <thead className="bg-black/5 text-xs font-semibold uppercase tracking-wider dark:bg-white/5">
          <tr>
            <th className="px-4 py-3">Nazwa</th>
            <th className="px-4 py-3">NIP</th>
            <th className="px-4 py-3">E-mail</th>
            <th className="px-4 py-3">Telefon</th>
            <th className="px-4 py-3 text-right">Akcje</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#262626]">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
              <td className="px-4 py-4 font-medium">
                <div>{client.name}</div>
                {client.address && (
                  <div className="text-xs text-black/50 dark:text-white/50 mt-0.5">{client.address}</div>
                )}
              </td>
              <td className="px-4 py-4 text-black/60 dark:text-white/60">{client.nip ?? "—"}</td>
              <td className="px-4 py-4 text-black/60 dark:text-white/60">{client.email ?? "—"}</td>
              <td className="px-4 py-4 text-black/60 dark:text-white/60">{client.phone ?? "—"}</td>
              <td className="px-4 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/clients/${client.id}/edit`}>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Edytuj">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-red-500/30 text-red-500 hover:bg-red-500/10"
                    title="Usuń"
                    onClick={() => handleDelete(client.id)}
                    disabled={deletingId === client.id}
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
