import { NextRequest, NextResponse } from "next/server";

import { normalizeNip } from "@/core/use-cases/validate-nip";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import {
  profilePatchSchema,
  profileResponseSchema,
} from "@/lib/schemas/profile";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const repository = new SupabaseProfileRepository();
    let profile = await repository.getById(user.id);

    if (!profile) {
      profile = await repository.upsert({
        id: user.id,
        email: user.email ?? "",
      });
    }

    const responseData = profileResponseSchema.parse({
      email: profile.email,
      companyName: profile.companyName ?? "",
      nip: profile.nip ?? "",
      address: profile.address ?? "",
      bankAccount: profile.bankAccount ?? "",
      goldSubscription: profile.goldSubscription ?? false,
    });

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Profile GET error:", error);
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

    const payload = parsed.data;
    const repository = new SupabaseProfileRepository();

    const updatedProfile = await repository.upsert({
      id: user.id,
      email: user.email ?? "",
      companyName: payload.companyName,
      nip: payload.nip ? normalizeNip(payload.nip) : undefined,
      address: payload.address,
      bankAccount: payload.bankAccount,
      goldSubscription: payload.goldSubscription,
    });

    const responseData = profileResponseSchema.parse({
      email: updatedProfile.email,
      companyName: updatedProfile.companyName ?? "",
      nip: updatedProfile.nip ?? "",
      address: updatedProfile.address ?? "",
      bankAccount: updatedProfile.bankAccount ?? "",
      goldSubscription: updatedProfile.goldSubscription ?? false,
    });

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json({ error: "Profile update failed." }, { status: 500 });
  }
}
