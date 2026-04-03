import type { UseFormRegister, FieldErrors } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { InvoiceFormValues } from "@/lib/schemas/invoice";

interface InvoiceFormPartyProps {
  type: "issuer" | "client";
  register: UseFormRegister<InvoiceFormValues>;
  errors: FieldErrors<InvoiceFormValues>;
  onGusFetch?: () => void;
  gusStatus?: string | null;
}

export function InvoiceFormParty({ type, register, errors, onGusFetch, gusStatus }: InvoiceFormPartyProps) {
  const isIssuer = type === "issuer";
  const title = isIssuer ? "Sprzedawca" : "Nabywca";
  const prefix = isIssuer ? "issuer" : "client";

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl">{title}</h3>
        {!isIssuer && onGusFetch && (
          <Button type="button" size="sm" variant="outline" onClick={onGusFetch}>
            Pobierz dane z GUS
          </Button>
        )}
      </div>

      <FormField
        label="Nazwa"
        htmlFor={`${prefix}Name`}
        error={(errors as any)[`${prefix}Name`]?.message}
      >
        <Input id={`${prefix}Name`} {...register(`${prefix}Name` as any)} />
      </FormField>

      <FormField
        label="NIP"
        htmlFor={`${prefix}Nip`}
        error={(errors as any)[`${prefix}Nip`]?.message}
      >
        <Input
          id={`${prefix}Nip`}
          placeholder={isIssuer ? "526-00-01-222" : "525-235-29-07"}
          {...register(`${prefix}Nip` as any)}
        />
      </FormField>

      <FormField
        label="Adres"
        htmlFor={`${prefix}Address`}
        error={(errors as any)[`${prefix}Address`]?.message}
      >
        <Input
          id={`${prefix}Address`}
          placeholder={isIssuer ? "ul. Wiejska 4, 00-902 Warszawa" : "ul. Złota 44, 00-120 Warszawa"}
          {...register(`${prefix}Address` as any)}
        />
      </FormField>

      {!isIssuer && gusStatus && (
        <p className="text-xs text-gold-dark">{gusStatus}</p>
      )}
    </section>
  );
}
