"use server";

import { revalidatePath } from "next/cache";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";

/**
 * Server Action to update company data in the user's profile.
 */
export async function updateCompanyDataAction(data: {
  id: string;
  email: string;
  companyName: string | null;
  nip: string | null;
  address: string | null;
  bankAccount: string | null;
}) {
  const profileRepository = new SupabaseProfileRepository();
  try {
    const result = await profileRepository.upsert(data);
    revalidatePath("/settings/company");
    return { data: result };
  } catch (err) {
    console.error("Action error updating company data:", err);
    return { error: "Wystąpił błąd podczas zapisywania danych firmy." };
  }
}

/**
 * Server Action to synchronize the user's Google avatar with their profile.
 */
export async function syncUserAvatarAction({ 
  userId, 
  email, 
  avatarUrl 
}: { 
  userId: string; 
  email: string; 
  avatarUrl: string | null 
}) {
  const profileRepository = new SupabaseProfileRepository();
  return await profileRepository.upsert({
    id: userId,
    email: email,
    avatarUrl: avatarUrl,
  }).catch((err) => {
    console.error("Action error syncing avatar:", err);
    return null;
  });
}
