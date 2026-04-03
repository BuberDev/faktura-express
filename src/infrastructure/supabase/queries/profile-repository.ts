import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/supabase/db";
import { profiles } from "@/core/domain/schema";

export interface ProfileEntity {
  id: string;
  email: string;
  companyName: string | null;
  nip: string | null;
  address: string | null;
  bankAccount: string | null;
  goldSubscription: boolean | null;
}

export class SupabaseProfileRepository {
  async getById(id: string): Promise<ProfileEntity | null> {
    const data = await db.query.profiles.findFirst({
      where: eq(profiles.id, id),
    });

    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      companyName: data.companyName,
      nip: data.nip,
      address: data.address,
      bankAccount: data.bankAccount,
      goldSubscription: data.goldSubscription,
    };
  }

  async upsert(profile: Partial<ProfileEntity> & { id: string; email: string }): Promise<ProfileEntity> {
    const [result] = await db
      .insert(profiles)
      .values({
        id: profile.id,
        email: profile.email,
        companyName: profile.companyName,
        nip: profile.nip,
        address: profile.address,
        bankAccount: profile.bankAccount,
        goldSubscription: profile.goldSubscription,
      })
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          companyName: profile.companyName,
          nip: profile.nip,
          address: profile.address,
          bankAccount: profile.bankAccount,
          goldSubscription: profile.goldSubscription,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!result) {
      throw new Error("Failed to upsert profile");
    }

    return {
      id: result.id,
      email: result.email,
      companyName: result.companyName,
      nip: result.nip,
      address: result.address,
      bankAccount: result.bankAccount,
      goldSubscription: result.goldSubscription,
    };
  }
}
