"use server";

import { revalidatePath } from "next/cache";
import { SupabaseProductRepository } from "@/infrastructure/supabase/queries/product-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import type { CreateProductInput, UpdateProductInput } from "@/core/domain/entities/product-entity";

const repository = new SupabaseProductRepository();

export async function createProductAction(input: Omit<CreateProductInput, "userId">) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Brak autoryzacji." };

  try {
    const id = await repository.create({ ...input, userId: user.id });
    revalidatePath("/products");
    return { id };
  } catch {
    return { error: "Nie udało się zapisać usługi/towaru." };
  }
}

export async function updateProductAction(id: string, input: UpdateProductInput) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Brak autoryzacji." };

  const existing = await repository.getByIdForUser(id, user.id);
  if (!existing) return { error: "Nie znaleziono usługi/towaru." };

  try {
    await repository.update(id, input);
    revalidatePath("/products");
    return { success: true };
  } catch {
    return { error: "Nie udało się zaktualizować usługi/towaru." };
  }
}

export async function deleteProductAction(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Brak autoryzacji." };

  const existing = await repository.getByIdForUser(id, user.id);
  if (!existing) return { error: "Nie znaleziono usługi/towaru." };

  try {
    await repository.delete(id);
    revalidatePath("/products");
    return { success: true };
  } catch {
    return { error: "Nie udało się usunąć usługi/towaru." };
  }
}
