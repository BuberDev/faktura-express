import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

import { normalizeNip } from "@/core/use-cases/validate-nip";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import {
  profilePatchSchema,
  profileResponseSchema,
  type ProfilePatchPayload,
} from "@/lib/schemas/profile";

interface ProfileRow {
  id: string;
  email: string | null;
  company_name: string | null;
  nip: string | null;
  address: string | null;
  bank_account: string | null;
  gold_subscription: boolean | null;
}

function mapProfileRowToResponse(row: ProfileRow, fallbackEmail: string | null) {
  const mapped = {
    email: row.email ?? fallbackEmail ?? "",
    companyName: row.company_name ?? "",
    nip: row.nip ?? "",
    address: row.address ?? "",
    bankAccount: row.bank_account ?? "",
    goldSubscription: row.gold_subscription ?? false,
  };

  return profileResponseSchema.parse(mapped);
}

async function getOrCreateProfileRow(
  supabase: SupabaseClient,
  userId: string,
  userEmail: string | null,
): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, company_name, nip, address, bank_account, gold_subscription")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Profile query failed: ${error.message}`);
  }

  if (data) {
    return data as ProfileRow;
  }

  const { data: insertedProfile, error: insertError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        email: userEmail,
      },
      { onConflict: "id" },
    )
    .select("id, email, company_name, nip, address, bank_account, gold_subscription")
    .single();

  if (insertError || !insertedProfile) {
    throw new Error(`Profile create query failed: ${insertError?.message}`);
  }

  return insertedProfile as ProfileRow;
}

function mapPatchPayloadToDbUpdate(payload: ProfilePatchPayload) {
  const updatePayload: Record<string, string | boolean | null> = {};

  if (payload.companyName !== undefined) {
    updatePayload.company_name = payload.companyName || null;
  }

  if (payload.nip !== undefined) {
    updatePayload.nip = payload.nip ? normalizeNip(payload.nip) : null;
  }

  if (payload.address !== undefined) {
    updatePayload.address = payload.address || null;
  }

  if (payload.bankAccount !== undefined) {
    updatePayload.bank_account = payload.bankAccount || null;
  }

  if (payload.goldSubscription !== undefined) {
    updatePayload.gold_subscription = payload.goldSubscription;
  }

  return updatePayload;
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const row = await getOrCreateProfileRow(supabase, user.id, user.email ?? null);
    return NextResponse.json(mapProfileRowToResponse(row, user.email ?? null), { status: 200 });
  } catch {
    return NextResponse.json({ error: "Profile read failed." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as unknown;
    const parsed = profilePatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid payload." },
        { status: 400 },
      );
    }

    const updates = mapPatchPayloadToDbUpdate(parsed.data);
    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          email: user.email ?? null,
          ...updates,
        },
        { onConflict: "id" },
      )
      .select("id, email, company_name, nip, address, bank_account, gold_subscription")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Profile update failed." }, { status: 500 });
    }

    return NextResponse.json(mapProfileRowToResponse(data as ProfileRow, user.email ?? null), {
      status: 200,
    });
  } catch {
    return NextResponse.json({ error: "Profile update failed." }, { status: 500 });
  }
}
