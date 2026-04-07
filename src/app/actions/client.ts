"use server";

import { revalidatePath } from "next/cache";
import { SupabaseClientRepository } from "@/infrastructure/supabase/queries/client-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import type { CreateClientInput, UpdateClientInput } from "@/core/domain/entities/client-entity";

const repository = new SupabaseClientRepository();

export async function createClientAction(input: Omit<CreateClientInput, "userId">) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Brak autoryzacji." };

  try {
    const id = await repository.create({ ...input, userId: user.id });
    revalidatePath("/clients");
    return { id };
  } catch {
    return { error: "Nie udało się zapisać kontrahenta." };
  }
}

export async function updateClientAction(id: string, input: UpdateClientInput) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Brak autoryzacji." };

  const existing = await repository.getByIdForUser(id, user.id);
  if (!existing) return { error: "Kontrahent nie znaleziony." };

  try {
    await repository.update(id, input);
    revalidatePath("/clients");
    return { success: true };
  } catch {
    return { error: "Nie udało się zaktualizować kontrahenta." };
  }
}

export async function deleteClientAction(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Brak autoryzacji." };

  const existing = await repository.getByIdForUser(id, user.id);
  if (!existing) return { error: "Kontrahent nie znaleziony." };

  try {
    await repository.delete(id);
    revalidatePath("/clients");
    return { success: true };
  } catch {
    return { error: "Nie udało się usunąć kontrahenta." };
  }
}
