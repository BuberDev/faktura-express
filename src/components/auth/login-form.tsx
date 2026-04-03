"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { SignInPage, type Testimonial } from "@/components/ui/sign-in";
import { loginSchema } from "@/lib/schemas/auth";
import { hasSupabaseEnvironment } from "@/infrastructure/supabase/env";
import { getSupabaseBrowserClient } from "@/infrastructure/supabase/browser-client";

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    name: "Anna Kowalska",
    handle: "@annabiz",
    text: "W końcu narzędzie, które pozwala mi wystawić fakturę w chwilę i bez błędów.",
  },
  {
    avatarSrc:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    name: "Marek Nowak",
    handle: "@marekdev",
    text: "Interfejs jest prosty, szybki i dokładnie taki, jakiego potrzebuje mała firma.",
  },
  {
    avatarSrc:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    name: "Piotr Zieliński",
    handle: "@piotrfirma",
    text: "Logowanie i obsługa faktur są bardzo wygodne, wszystko działa stabilnie.",
  },
];

interface LoginFormProps {
  initialFormError?: string | null;
}

export function LoginForm({ initialFormError = null }: LoginFormProps) {
  const [formError, setFormError] = useState<string | null>(initialFormError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function onSignIn(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Sprawdź poprawność danych logowania.");
      return;
    }

    if (!hasSupabaseEnvironment) {
      setFormError("Brakuje konfiguracji Supabase w zmiennych środowiskowych.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const client = getSupabaseBrowserClient();
    const { error } = await client.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    setIsSubmitting(false);

    if (error) {
      setFormError("Nie udało się zalogować. Sprawdź dane logowania.");
      return;
    }

    const redirectTo =
      new URLSearchParams(window.location.search).get("redirectTo") ||
      "/dashboard";
    router.push(redirectTo);
    router.refresh();
  }

  async function onGoogleSignIn(): Promise<void> {
    if (!hasSupabaseEnvironment) {
      setFormError("Brakuje konfiguracji Supabase w zmiennych środowiskowych.");
      return;
    }

    const client = getSupabaseBrowserClient();
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setFormError(error.message || "Logowanie Google nie powiodło się.");
    }
  }

  function onResetPassword(): void {
    router.push("/auth/forgot-password");
  }

  function onCreateAccount(): void {
    router.push("/auth/register");
  }

  return (
    <SignInPage
      title={<span className="font-light tracking-tighter">Logowanie</span>}
      description={
        <span>
          Zaloguj się, aby wystawiać faktury i zarządzać klientami.
          {isSubmitting ? (
            <span className="ml-2 inline-block text-gold-dark dark:text-gold-light">Trwa logowanie...</span>
          ) : null}
          {formError ? (
            <span className="mt-2 block text-gold-dark dark:text-gold-light">{formError}</span>
          ) : null}
        </span>
      }
      heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?auto=format&fit=crop&w=1600&q=80"
      testimonials={sampleTestimonials}
      onSignIn={onSignIn}
      onGoogleSignIn={onGoogleSignIn}
      onResetPassword={onResetPassword}
      onCreateAccount={onCreateAccount}
    />
  );
}
