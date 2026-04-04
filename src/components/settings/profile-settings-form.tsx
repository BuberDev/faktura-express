"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { fetchCurrentProfile, updateCurrentProfile } from "@/infrastructure/api/profile-client";
import {
  profileSettingsSchema,
  type ProfileSettingsValues,
} from "@/lib/schemas/profile";

export function ProfileSettingsForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileSettingsValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      setStatusError(null);

      try {
        const profile = await fetchCurrentProfile();
        reset({
          email: profile.email,
        });
      } catch {
        setStatusError("Nie udało się pobrać danych profilu.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, [reset]);

  async function onSubmit(values: ProfileSettingsValues): Promise<void> {
    setStatusError(null);
    setStatusMessage(null);

    try {
      const updatedProfile = await updateCurrentProfile({});

      reset({
        email: updatedProfile.email,
      });

      setStatusMessage("Ustawienia profilu zostały zapisane.");
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : "Nie udało się zapisać ustawień profilu.");
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl rounded-md border border-gold-subtle bg-gold/5 p-4 text-sm">
        Ładowanie danych profilu...
      </div>
    );
  }

  return (
    <form className="max-w-2xl space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Adres e-mail konta" htmlFor="email" error={errors.email?.message}>
        <Input id="email" disabled autoComplete="email" {...register("email")} />
      </FormField>

      {statusError ? <p className="text-sm text-gold-dark">{statusError}</p> : null}
      {statusMessage ? <p className="text-sm text-gold-dark">{statusMessage}</p> : null}

      <Button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? "Zapisywanie..." : "Zapisz ustawienia profilu"}
      </Button>
    </form>
  );
}
