"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { fetchCurrentProfile, updateCurrentProfile } from "@/infrastructure/api/profile-client";
import {
  companySettingsSchema,
  type CompanySettingsValues,
} from "@/lib/schemas/profile";

export function CompanySettingsForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CompanySettingsValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      companyName: "",
      nip: "",
      address: "",
      bankAccount: "",
    },
  });

  useEffect(() => {
    async function loadCompanyData() {
      setIsLoading(true);
      setStatusError(null);

      try {
        const profile = await fetchCurrentProfile();

        reset({
          companyName: profile.companyName,
          nip: profile.nip,
          address: profile.address,
          bankAccount: profile.bankAccount,
        });
      } catch {
        setStatusError("Nie udało się pobrać danych firmy.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadCompanyData();
  }, [reset]);

  async function onSubmit(values: CompanySettingsValues): Promise<void> {
    setStatusError(null);
    setStatusMessage(null);

    try {
      const profile = await updateCurrentProfile({
        companyName: values.companyName,
        nip: values.nip,
        address: values.address,
        bankAccount: values.bankAccount,
      });

      reset({
        companyName: profile.companyName,
        nip: profile.nip,
        address: profile.address,
        bankAccount: profile.bankAccount,
      });

      setStatusMessage("Dane firmy zostały zapisane.");
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : "Nie udało się zapisać danych firmy.");
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl rounded-md border border-gold-subtle bg-gold/5 p-4 text-sm">
        Ładowanie danych firmy...
      </div>
    );
  }

  return (
    <form className="max-w-2xl space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Nazwa firmy" htmlFor="companyName" error={errors.companyName?.message}>
        <Input id="companyName" placeholder="Faktura In Sp. z o.o." {...register("companyName")} />
      </FormField>

      <FormField label="NIP" htmlFor="nip" error={errors.nip?.message}>
        <Input id="nip" placeholder="5252739428" {...register("nip")} />
      </FormField>

      <FormField label="Adres" htmlFor="address" error={errors.address?.message}>
        <Input id="address" placeholder="ul. Złota 1, 00-001 Warszawa" {...register("address")} />
      </FormField>

      <FormField label="Numer konta" htmlFor="bankAccount" error={errors.bankAccount?.message}>
        <Input
          id="bankAccount"
          placeholder="00 0000 0000 0000 0000 0000 0000"
          {...register("bankAccount")}
        />
      </FormField>

      {statusError ? <p className="text-sm text-gold-dark">{statusError}</p> : null}
      {statusMessage ? <p className="text-sm text-gold-dark">{statusMessage}</p> : null}

      <Button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? "Zapisywanie..." : "Zapisz dane firmy"}
      </Button>
    </form>
  );
}
