import { NextRequest, NextResponse } from "next/server";

import { normalizeNip, isValidNip } from "@/core/use-cases/validate-nip";
import { BirRegonApiClient } from "@/infrastructure/api/gus-client";

export async function GET(request: NextRequest) {
  const rawNip = request.nextUrl.searchParams.get("nip") ?? "";
  const nip = normalizeNip(rawNip);

  if (!isValidNip(nip)) {
    return NextResponse.json({ error: "Invalid NIP." }, { status: 400 });
  }

  const client = new BirRegonApiClient();
  const company = await client.findByNip(nip);

  if (!company) {
    return NextResponse.json({ error: "Company not found." }, { status: 404 });
  }

  return NextResponse.json(company, { status: 200 });
}
