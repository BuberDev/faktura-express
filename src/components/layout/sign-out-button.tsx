"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/infrastructure/supabase/browser-client";
import { hasSupabaseEnvironment } from "@/infrastructure/supabase/env";

interface SignOutButtonProps {
  className?: string;
}

export function SignOutButton({ className }: SignOutButtonProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function onSignOut(): Promise<void> {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    if (hasSupabaseEnvironment) {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    }

    router.push("/auth/login");
    router.refresh();
    setIsSigningOut(false);
  }

  return (
    <Button className={className} variant="outline" size="sm" onClick={onSignOut} disabled={isSigningOut}>
      {isSigningOut ? "Wylogowywanie..." : "Wyloguj"}
    </Button>
  );
}
