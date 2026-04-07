"use server";

import { revalidatePath } from "next/cache";
import { SupabaseBankAccountRepository } from "@/infrastructure/supabase/queries/bank-account-repository";
import { SupabasePaymentMethodRepository } from "@/infrastructure/supabase/queries/payment-method-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import type { CreateBankAccountInput, UpdateBankAccountInput } from "@/core/domain/entities/bank-account-entity";
import type { CreatePaymentMethodInput, UpdatePaymentMethodInput } from "@/core/domain/entities/payment-method-entity";

const bankRepo = new SupabaseBankAccountRepository();
const pmRepo = new SupabasePaymentMethodRepository();

// Bank Accounts
export async function createBankAccountAction(input: Omit<CreateBankAccountInput, "userId">) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Brak autoryzacji." };
  try {
    const id = await bankRepo.create({ ...input, userId: user.id });
    revalidatePath("/settings/bank-accounts");
    return { id };
  } catch {
    return { error: "Nie udało się zapisać rachunku bankowego." };
  }
}

export async function updateBankAccountAction(id: string, input: UpdateBankAccountInput) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Brak autoryzacji." };
  try {
    await bankRepo.update(id, user.id, input);
    revalidatePath("/settings/bank-accounts");
    return { success: true };
  } catch {
    return { error: "Nie udało się zaktualizować rachunku." };
  }
}

export async function deleteBankAccountAction(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Brak autoryzacji." };
  try {
    await bankRepo.delete(id);
    revalidatePath("/settings/bank-accounts");
    return { success: true };
  } catch {
    return { error: "Nie udało się usunąć rachunku." };
  }
}

// Payment Methods
export async function createPaymentMethodAction(input: Omit<CreatePaymentMethodInput, "userId">) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Brak autoryzacji." };
  try {
    const id = await pmRepo.create({ ...input, userId: user.id });
    revalidatePath("/settings/payment-methods");
    return { id };
  } catch {
    return { error: "Nie udało się zapisać formy płatności." };
  }
}

export async function updatePaymentMethodAction(id: string, input: UpdatePaymentMethodInput) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Brak autoryzacji." };
  try {
    await pmRepo.update(id, user.id, input);
    revalidatePath("/settings/payment-methods");
    return { success: true };
  } catch {
    return { error: "Nie udało się zaktualizować formy płatności." };
  }
}

export async function deletePaymentMethodAction(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Brak autoryzacji." };
  try {
    await pmRepo.delete(id);
    revalidatePath("/settings/payment-methods");
    return { success: true };
  } catch {
    return { error: "Nie udało się usunąć formy płatności." };
  }
}
