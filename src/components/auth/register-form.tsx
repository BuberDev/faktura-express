"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/infrastructure/supabase/browser-client";
import { hasSupabaseEnvironment } from "@/infrastructure/supabase/env";
import { registerSchema, type RegisterFormValues } from "@/lib/schemas/auth";

export function RegisterForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues): Promise<void> {
    if (!hasSupabaseEnvironment) {
      setFormError("Brakuje konfiguracji Supabase w zmiennych środowiskowych.");
      return;
    }

    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    const client = getSupabaseBrowserClient();
    const { data, error } = await client.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    setIsSubmitting(false);

    if (error) {
      setFormError("Nie udało się założyć konta. Sprawdź dane i spróbuj ponownie.");
      return;
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setFormSuccess(
        "Konto z tym e-mailem już istnieje. Zaloguj się Google lub użyj resetu hasła, aby dodać logowanie hasłem.",
      );
      return;
    }

    setFormSuccess("Konto utworzone. Sprawdź skrzynkę e-mail i potwierdź rejestrację.");
    router.refresh();
  }

  async function signInWithGoogle(): Promise<void> {
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
      setFormError(
        "Rejestracja przez Google nie powiodła się. Sprawdź konfigurację Google Provider w Supabase oraz redirect URL.",
      );
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Adres e-mail" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
      </FormField>

      <FormField label="Hasło" htmlFor="password" error={errors.password?.message}>
        <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
      </FormField>

      <FormField
        label="Powtórz hasło"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
      >
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
      </FormField>

      {formError ? <p className="text-sm text-[#996515]">{formError}</p> : null}
      {formSuccess ? <p className="text-sm text-gold-dark">{formSuccess}</p> : null}

      <Button className="w-full cursor-pointer" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Tworzenie konta..." : "Załóż konto"}
      </Button>

      <Button className="w-full cursor-pointer" type="button" variant="outline" onClick={signInWithGoogle}>
        Kontynuuj przez Google
      </Button>

      <p className="text-xs text-white/65">
        Masz już konto?{" "}
        <Link href="/auth/login" className="text-gold-light hover:underline cursor-pointer">
          Zaloguj się
        </Link>
      </p>
    </form>
  );
}
