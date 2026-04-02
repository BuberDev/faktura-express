"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/infrastructure/supabase/browser-client";
import { hasSupabaseEnvironment } from "@/infrastructure/supabase/env";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/schemas/auth";

export function ForgotPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues): Promise<void> {
    if (!hasSupabaseEnvironment) {
      setFormError("Brakuje konfiguracji Supabase w zmiennych środowiskowych.");
      return;
    }

    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    const client = getSupabaseBrowserClient();
    const { error } = await client.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/login`,
    });

    setIsSubmitting(false);

    if (error) {
      setFormError("Nie udało się wysłać linku resetującego.");
      return;
    }

    setFormSuccess("Wysłaliśmy link resetujący na podany adres e-mail.");
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Adres e-mail" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
      </FormField>

      {formError ? <p className="text-sm text-[#996515]">{formError}</p> : null}
      {formSuccess ? <p className="text-sm text-gold-dark">{formSuccess}</p> : null}

      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Wysyłanie..." : "Wyślij link resetujący"}
      </Button>

      <p className="text-xs text-black/65 dark:text-white/65">
        <Link href="/auth/login" className="text-gold hover:underline">
          Powrót do logowania
        </Link>
      </p>
    </form>
  );
}
