"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { InvoiceEntity } from "@/core/domain/entities/invoice-entity";
import { calculateInvoiceTotals } from "@/core/use-cases/calculate-vat";
import { isValidNip, normalizeNip } from "@/core/use-cases/validate-nip";
import { invoiceFormSchema, type InvoiceFormValues } from "@/lib/schemas/invoice";
import { cn } from "@/lib/utils";

import { InvoiceFormItems } from "./invoice-form-items";
import { InvoiceFormMetadata } from "./invoice-form-metadata";
import { InvoiceFormParty } from "./invoice-form-party";
import { InvoiceLivePreview } from "./invoice-live-preview";
import { InvoicePdfDownloadButton } from "./invoice-pdf-download-button";

const todaysDate = new Date().toISOString().slice(0, 10);

const defaultInvoiceValues: InvoiceFormValues = {
  number: `FV/${new Date().getFullYear()}/001`,
  type: "VAT",
  issueDate: todaysDate,
  saleDate: todaysDate,
  dueDate: todaysDate,
  issuerName: "",
  issuerNip: "",
  issuerAddress: "",
  clientName: "",
  clientNip: "",
  clientAddress: "",
  status: "unpaid",
  items: [
    {
      description: "Usługa B2B",
      quantity: 1,
      unit: "szt",
      netPrice: "1000.00",
      vatRate: "23",
    },
  ],
};

export function InvoiceWorkspace() {
  const router = useRouter();
  const [activeMobilePanel, setActiveMobilePanel] = useState<"form" | "preview">("form");
  const [gusStatus, setGusStatus] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const {
    control,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: defaultInvoiceValues,
    mode: "onBlur",
  });

  const watchedValues = useWatch({ control }) as InvoiceFormValues;

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const profile = (await response.json()) as {
            companyName?: string;
            nip?: string;
            address?: string;
          };

          if (profile.companyName) setValue("issuerName", profile.companyName);
          if (profile.nip) setValue("issuerNip", profile.nip);
          if (profile.address) setValue("issuerAddress", profile.address);
        }
      } catch (err) {
        console.error("Failed to load profile for pre-fill:", err);
      }
    }

    loadProfile();
  }, [setValue]);

  async function fetchCompanyFromGus(): Promise<void> {
    const rawNip = getValues("clientNip");
    const normalizedNip = normalizeNip(rawNip);

    if (!isValidNip(normalizedNip)) {
      setGusStatus("Podaj poprawny NIP nabywcy przed pobraniem danych z GUS.");
      return;
    }

    setGusStatus("Pobieranie danych z GUS...");

    try {
      const response = await fetch(`/api/gus?nip=${normalizedNip}`);
      if (!response.ok) {
        setGusStatus("Nie znaleziono danych firmy w GUS.");
        return;
      }

      const payload = (await response.json()) as {
        name: string;
        nip: string;
        address: string;
      };

      setValue("clientName", payload.name, { shouldValidate: true });
      setValue("clientNip", payload.nip, { shouldValidate: true });
      setValue("clientAddress", payload.address, { shouldValidate: true });
      setGusStatus("Dane nabywcy zostały uzupełnione na podstawie GUS.");
    } catch {
      setGusStatus("Wystąpił błąd podczas komunikacji z GUS.");
    }
  }

  function getPreviewInvoice(): InvoiceEntity {
    const values = watchedValues ?? defaultInvoiceValues;
    const totals = calculateInvoiceTotals(values.items);
    return {
      id: "preview",
      userId: "preview",
      number: values.number,
      type: values.type,
      issueDate: values.issueDate,
      saleDate: values.saleDate,
      dueDate: values.dueDate,
      status: values.status,
      issuer: {
        name: values.issuerName,
        nip: values.issuerNip,
        address: values.issuerAddress,
      },
      client: {
        name: values.clientName,
        nip: values.clientNip,
        address: values.clientAddress,
      },
      items: values.items.map((item) => ({
        ...item,
        netPrice: item.netPrice,
      })),
      totalNet: totals.net,
      totalVat: totals.vat,
      totalGross: totals.gross,
    };
  }

  async function onSubmit(values: InvoiceFormValues): Promise<void> {
    setSubmitStatus("Zapisywanie faktury...");

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as { id?: string; error?: string };

      if (!response.ok || !payload.id) {
        setSubmitStatus(payload.error || "Nie udało się zapisać faktury.");
        return;
      }

      setSubmitStatus("Faktura została zapisana. Przekierowanie do szczegółów...");
      router.push(`/invoices/${payload.id}`);
      router.refresh();
    } catch {
      setSubmitStatus("Wystąpił błąd podczas zapisu faktury.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 rounded-md border border-gold-subtle bg-gold/5 p-1 md:hidden">
        <Button
          type="button"
          variant={activeMobilePanel === "form" ? "primary" : "ghost"}
          onClick={() => setActiveMobilePanel("form")}
        >
          Formularz
        </Button>
        <Button
          type="button"
          variant={activeMobilePanel === "preview" ? "primary" : "ghost"}
          onClick={() => setActiveMobilePanel("preview")}
        >
          Podgląd na żywo
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <form
          className={cn(
            "space-y-6 rounded-md border border-gold-subtle bg-gradient-to-b from-white to-[#F9F9F9] p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] dark:bg-dark-surface",
            activeMobilePanel === "form" ? "block" : "hidden md:block",
          )}
          onSubmit={handleSubmit(onSubmit)}
        >
          <InvoiceFormMetadata register={register} errors={errors} />

          <InvoiceFormParty type="issuer" register={register} errors={errors} />

          <InvoiceFormParty
            type="client"
            register={register}
            errors={errors}
            onGusFetch={fetchCompanyFromGus}
            gusStatus={gusStatus}
          />

          <InvoiceFormItems control={control} register={register} errors={errors} />

          {submitStatus ? <p className="text-sm text-gold-dark">{submitStatus}</p> : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Zapisywanie..." : "Wystaw fakturę"}
          </Button>
        </form>

        <aside
          className={cn(
            "space-y-4",
            activeMobilePanel === "preview" ? "block" : "hidden md:block",
          )}
        >
          <InvoiceLivePreview values={watchedValues ?? defaultInvoiceValues} />
          <InvoicePdfDownloadButton invoice={getPreviewInvoice()} variant="gold" />
        </aside>
      </div>
    </div>
  );
}
