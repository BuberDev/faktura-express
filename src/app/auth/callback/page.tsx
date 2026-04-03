"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/infrastructure/supabase/browser-client";
import { syncUserAvatarAction } from "@/app/actions/profile";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    // Guard against React Strict Mode double-invocation
    if (hasRun.current) return;
    hasRun.current = true;

    async function handleAuth() {
      // Google returns tokens in the URL hash fragment: #id_token=...
      const hash = window.location.hash;

      if (!hash) {
        const params = new URLSearchParams(window.location.search);
        const urlError = params.get("error");
        setError(urlError ?? "Brak tokenu autoryzacyjnego.");
        return;
      }

      const params = new URLSearchParams(hash.substring(1));
      const idToken = params.get("id_token");

      if (!idToken) {
        setError("Brak tokenu ID od Google.");
        return;
      }

      // Read the ORIGINAL (unhashed) nonce stored before redirect
      // Supabase will SHA-256 hash it internally and compare with what's in the JWT
      const rawNonce = localStorage.getItem("google_auth_nonce");

      const supabase = getSupabaseBrowserClient();

      const { data, error: signInError } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
        nonce: rawNonce ?? undefined,
      });

      if (signInError) {
        console.error("Auth error:", signInError.message);
        setError(signInError.message);
        return;
      }

      // Clean up nonce after successful login
      localStorage.removeItem("google_auth_nonce");

      // Sync Google avatar to the profiles table so the sidebar shows it
      if (data.user) {
        await syncUserAvatarAction({
          userId: data.user.id,
          email: data.user.email ?? "",
          avatarUrl:
            data.user.user_metadata?.avatar_url ??
            data.user.user_metadata?.picture ??
            null,
        });
      }

      router.replace("/dashboard");
    }

    handleAuth();
  }, [router]);

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-black">
        <p className="text-xl font-semibold text-red-400">Błąd logowania</p>
        <p className="max-w-md text-center text-sm text-white/60">{error}</p>
        <button
          onClick={() => router.push("/auth/login")}
          className="rounded-lg border border-[#D4AF37] px-6 py-2 text-sm text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
        >
          Wróć do logowania
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-black">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
      <p className="animate-pulse text-sm text-white/60">Weryfikacja konta Google...</p>
    </div>
  );
}
