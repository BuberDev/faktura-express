import { type NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/infrastructure/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { response, user } = await getAuthenticatedUser(request);

  if (!user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);

    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/invoices/:path*", "/settings/:path*"],
};
