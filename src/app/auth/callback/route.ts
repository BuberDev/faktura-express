import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

import { supabaseEnv } from "@/infrastructure/supabase/env";

function sanitizeNextPath(nextPath: string | null): string {
  if (!nextPath || !nextPath.startsWith("/")) {
    return "/dashboard";
  }

  return nextPath;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = sanitizeNextPath(requestUrl.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/login?error=Brak%20kodu%20autoryzacji%20Google", requestUrl.origin),
    );
  }

  if (!supabaseEnv.url || !supabaseEnv.anonKey) {
    return NextResponse.redirect(
      new URL(
        "/auth/login?error=Brak%20konfiguracji%20Supabase%20dla%20OAuth",
        requestUrl.origin,
      ),
    );
  }

  const response = NextResponse.redirect(new URL(nextPath, requestUrl.origin));

  const supabase = createServerClient(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(
        "/auth/login?error=Nie%20udalo%20sie%20zakonczyc%20logowania%20Google",
        requestUrl.origin,
      ),
    );
  }

  return response;
}
