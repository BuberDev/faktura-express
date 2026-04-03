import type { UseFormRegister, FieldErrors } from "react-hook-form";

import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { InvoiceFormValues } from "@/lib/schemas/invoice";

interface InvoiceFormMetadataProps {
  register: UseFormRegister<InvoiceFormValues>;
  errors: FieldErrors<InvoiceFormValues>;
}

export function InvoiceFormMetadata({ register, errors }: InvoiceFormMetadataProps) {
  return (
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
  );
}
