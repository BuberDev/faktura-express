"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { hasSupabaseEnvironment } from "@/infrastructure/supabase/env";
import { getSupabaseBrowserClient } from "@/infrastructure/supabase/browser-client";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/auth";

export function LoginForm() {
  const [formError, setFormError] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const oauthError = new URLSearchParams(window.location.search).get("error");
    return oauthError ? decodeURIComponent(oauthError) : null;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues): Promise<void> {
    if (!hasSupabaseEnvironment) {
      setFormError("Brakuje konfiguracji Supabase w zmiennych środowiskowych.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const client = getSupabaseBrowserClient();
    const { error } = await client.auth.signInWithPassword({
      email: values.email,
      password: values.password,
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
        "Logowanie Google nie powiodło się. Sprawdź konfigurację Google Provider w Supabase oraz redirect URL.",
      );
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Adres e-mail" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
      </FormField>

      <FormField label="Hasło" htmlFor="password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
      </FormField>

      {formError ? <p className="text-sm text-[#996515]">{formError}</p> : null}

      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logowanie..." : "Zaloguj się"}
      </Button>

      <Button className="w-full" type="button" variant="outline" onClick={signInWithGoogle}>
        Zaloguj przez Google
      </Button>

      <div className="flex justify-between text-xs text-black/65 dark:text-white/65">
        <Link href="/auth/forgot-password" className="hover:text-gold">
          Nie pamiętasz hasła?
        </Link>
        <Link href="/auth/register" className="hover:text-gold">
          Załóż konto
        </Link>
      </div>
    </form>
  );
}
