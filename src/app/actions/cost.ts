"use server";

import { revalidatePath } from "next/cache";
import { SupabaseCostRepository } from "@/infrastructure/supabase/queries/cost-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import type { CreateCostInput, CostStatus } from "@/core/domain/entities/cost-entity";

const repository = new SupabaseCostRepository();

export async function createCostAction(input: Omit<CreateCostInput, "userId">) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Brak autoryzacji." };

  try {
    const id = await repository.create({ ...input, userId: user.id });
    revalidatePath("/costs");
    revalidatePath("/costs/invoices");
    revalidatePath("/costs/purchases");
    revalidatePath("/costs/orders");
    revalidatePath("/costs/ksef");
    return { id };
  } catch {
    return { error: "Nie udało się zapisać kosztu." };
  }
}

export async function updateCostStatusAction(id: string, status: CostStatus) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Brak autoryzacji." };

  const existing = await repository.getByIdForUser(id, user.id);
  if (!existing) return { error: "Koszt nie znaleziony." };

  try {
    await repository.updateStatus(id, status);
    revalidatePath("/costs/invoices");
    revalidatePath("/costs/purchases");
    revalidatePath("/costs/orders");
    revalidatePath("/costs/ksef");
    return { success: true };
  } catch {
    return { error: "Nie udało się zaktualizować statusu." };
  }
}

export async function deleteCostAction(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Brak autoryzacji." };

  const existing = await repository.getByIdForUser(id, user.id);
  if (!existing) return { error: "Koszt nie znaleziony." };

  try {
    await repository.delete(id);
    revalidatePath("/costs/invoices");
    revalidatePath("/costs/purchases");
    revalidatePath("/costs/orders");
    revalidatePath("/costs/ksef");
    return { success: true };
  } catch {
    return { error: "Nie udało się usunąć kosztu." };
  }
}
