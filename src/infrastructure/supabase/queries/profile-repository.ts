import type { SupabaseClient } from "@supabase/supabase-js";

export interface ProfileEntity {
  id: string;
  email: string;
  companyName: string | null;
  nip: string | null;
  address: string | null;
  bankAccount: string | null;
}

export class SupabaseProfileRepository {
  constructor(private readonly client: SupabaseClient) {}

  async getById(id: string): Promise<ProfileEntity | null> {
    const { data, error } = await this.client
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`Profile query failed: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      companyName: data.company_name,
      nip: data.nip,
      address: data.address,
      bankAccount: data.bank_account,
    };
  }

  async update(id: string, profile: Partial<ProfileEntity>): Promise<void> {
    const { error } = await this.client
      .from("profiles")
      .update({
        company_name: profile.companyName,
        nip: profile.nip,
        address: profile.address,
        bank_account: profile.bankAccount,
      })
      .eq("id", id);

    if (error) {
      throw new Error(`Profile update failed: ${error.message}`);
    }
  }
}
