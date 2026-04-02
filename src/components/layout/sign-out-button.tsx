"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/infrastructure/supabase/browser-client";

export function SignOutButton() {
  const router = useRouter();

  async function onSignOut(): Promise<void> {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={onSignOut}>
      Wyloguj
    </Button>
  );
}
