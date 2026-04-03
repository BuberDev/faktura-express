"use server";

import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";

/**
 * Server Action to synchronize the user's Google avatar with their profile.
 * This keeps all database logic on the server to avoid build errors.
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
