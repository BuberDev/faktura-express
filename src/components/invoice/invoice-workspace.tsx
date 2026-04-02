"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { isValidNip, normalizeNip } from "@/core/use-cases/validate-nip";
import { invoiceFormSchema, type InvoiceFormValues } from "@/lib/schemas/invoice";
import { cn } from "@/lib/utils";

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedValues = useWatch({ control }) as InvoiceFormValues;

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

  async function onSubmit(values: InvoiceFormValues): Promise<void> {
    setSubmitStatus(`Faktura ${values.number} jest gotowa do zapisu w bazie Supabase.`);
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
          <section className="grid gap-4 md:grid-cols-2">
            <FormField label="Numer faktury" htmlFor="number" error={errors.number?.message}>
              <Input id="number" {...register("number")} />
            </FormField>

            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium text-black/80 dark:text-white/80">
                Typ faktury
              </label>
              <select
                id="type"
                className="h-11 w-full rounded-md border border-[#E5E5E5] bg-white px-3 text-sm dark:border-[#262626] dark:bg-black"
                {...register("type")}
              >
                <option value="VAT">VAT</option>
                <option value="Proforma">Proforma</option>
                <option value="Correction">Korekta</option>
              </select>
            </div>

            <FormField label="Data wystawienia" htmlFor="issueDate" error={errors.issueDate?.message}>
              <Input id="issueDate" type="date" {...register("issueDate")} />
            </FormField>

            <FormField label="Data sprzedaży" htmlFor="saleDate" error={errors.saleDate?.message}>
              <Input id="saleDate" type="date" {...register("saleDate")} />
            </FormField>

            <FormField label="Termin płatności" htmlFor="dueDate" error={errors.dueDate?.message}>
              <Input id="dueDate" type="date" {...register("dueDate")} />
            </FormField>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium text-black/80 dark:text-white/80">
                Status
              </label>
              <select
                id="status"
                className="h-11 w-full rounded-md border border-[#E5E5E5] bg-white px-3 text-sm dark:border-[#262626] dark:bg-black"
                {...register("status")}
              >
                <option value="unpaid">Nieopłacona</option>
                <option value="paid">Opłacona</option>
              </select>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="font-display text-xl">Sprzedawca</h3>
            <FormField label="Nazwa" htmlFor="issuerName" error={errors.issuerName?.message}>
              <Input id="issuerName" {...register("issuerName")} />
            </FormField>
            <FormField label="NIP" htmlFor="issuerNip" error={errors.issuerNip?.message}>
              <Input id="issuerNip" {...register("issuerNip")} />
            </FormField>
            <FormField label="Adres" htmlFor="issuerAddress" error={errors.issuerAddress?.message}>
              <Input id="issuerAddress" {...register("issuerAddress")} />
            </FormField>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Nabywca</h3>
              <Button type="button" size="sm" variant="outline" onClick={fetchCompanyFromGus}>
                Pobierz dane z GUS
              </Button>
            </div>
            <FormField label="Nazwa" htmlFor="clientName" error={errors.clientName?.message}>
              <Input id="clientName" {...register("clientName")} />
            </FormField>
            <FormField label="NIP" htmlFor="clientNip" error={errors.clientNip?.message}>
              <Input id="clientNip" {...register("clientNip")} />
            </FormField>
            <FormField label="Adres" htmlFor="clientAddress" error={errors.clientAddress?.message}>
              <Input id="clientAddress" {...register("clientAddress")} />
            </FormField>
            {gusStatus ? <p className="text-xs text-gold-dark">{gusStatus}</p> : null}
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Pozycje</h3>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  append({
                    description: "",
                    quantity: 1,
                    unit: "szt",
                    netPrice: "0.00",
                    vatRate: "23",
                  })
                }
              >
                Dodaj pozycję
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="space-y-3 rounded-md border border-[#E5E5E5] p-4 dark:border-[#262626]">
                <FormField
                  label="Opis"
                  htmlFor={`items.${index}.description`}
                  error={errors.items?.[index]?.description?.message}
                >
                  <Input id={`items.${index}.description`} {...register(`items.${index}.description`)} />
                </FormField>

                <div className="grid gap-3 md:grid-cols-4">
                  <FormField
                    label="Ilość"
                    htmlFor={`items.${index}.quantity`}
                    error={errors.items?.[index]?.quantity?.message}
                  >
                    <Input
                      id={`items.${index}.quantity`}
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    />
                  </FormField>

                  <div className="space-y-2">
                    <label
                      htmlFor={`items.${index}.unit`}
                      className="text-sm font-medium text-black/80 dark:text-white/80"
                    >
                      Jednostka
                    </label>
                    <select
                      id={`items.${index}.unit`}
                      className="h-11 w-full rounded-md border border-[#E5E5E5] bg-white px-3 text-sm dark:border-[#262626] dark:bg-black"
                      {...register(`items.${index}.unit`)}
                    >
                      <option value="szt">szt</option>
                      <option value="godz">godz</option>
                      <option value="km">km</option>
                    </select>
                  </div>

                  <FormField
                    label="Cena netto"
                    htmlFor={`items.${index}.netPrice`}
                    error={errors.items?.[index]?.netPrice?.message}
                  >
                    <Input id={`items.${index}.netPrice`} {...register(`items.${index}.netPrice`)} />
                  </FormField>

                  <div className="space-y-2">
                    <label
                      htmlFor={`items.${index}.vatRate`}
                      className="text-sm font-medium text-black/80 dark:text-white/80"
                    >
                      Stawka VAT
                    </label>
                    <select
                      id={`items.${index}.vatRate`}
                      className="h-11 w-full rounded-md border border-[#E5E5E5] bg-white px-3 text-sm dark:border-[#262626] dark:bg-black"
                      {...register(`items.${index}.vatRate`)}
                    >
                      <option value="23">23%</option>
                      <option value="8">8%</option>
                      <option value="5">5%</option>
                      <option value="0">0%</option>
                      <option value="zw">zw</option>
                      <option value="np">np</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    Usuń pozycję
                  </Button>
                </div>
              </div>
            ))}
          </section>

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
          <InvoicePdfDownloadButton values={watchedValues ?? defaultInvoiceValues} />
        </aside>
      </div>
    </div>
  );
}
