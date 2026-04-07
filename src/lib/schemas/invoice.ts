import { z } from "zod";

import { isValidNip } from "@/core/use-cases/validate-nip";

export const invoiceFormSchema = z.object({
  number: z.string().min(1, "Numer faktury jest wymagany."),
  type: z.enum(["VAT", "Proforma", "Correction", "Bill", "Receipt", "Offer"]),
  issueDate: z.string().min(1, "Data wystawienia jest wymagana."),
  saleDate: z.string().min(1, "Data sprzedaży jest wymagana."),
  dueDate: z.string().min(1, "Termin płatności jest wymagany."),
  issuerName: z.string().min(1, "Nazwa sprzedawcy jest wymagana."),
  issuerNip: z.string().refine((value) => isValidNip(value), {
    message: "NIP sprzedawcy jest niepoprawny (wymagane 10 cyfr).",
  }),
  issuerAddress: z
    .string()
    .min(10, "Adres sprzedawcy musi zawierać pełne dane (ulica, kod pocztowy, miasto).")
    .refine((value) => /\d{2}-\d{3}/.test(value), {
      message: "Adres musi zawierać kod pocztowy w formacie 00-000.",
    }),
  clientName: z.string().min(1, "Nazwa nabywcy jest wymagana."),
  clientNip: z.string().refine((value) => isValidNip(value), {
    message: "NIP nabywcy jest niepoprawny (wymagane 10 cyfr).",
  }),
  clientAddress: z
    .string()
    .min(10, "Adres nabywcy musi zawierać pełne dane (ulica, kod pocztowy, miasto).")
    .refine((value) => /\d{2}-\d{3}/.test(value), {
      message: "Adres musi zawierać kod pocztowy w formacie 00-000.",
    }),
  status: z.enum(["unpaid", "paid"]),
  items: z
    .array(
      z.object({
        description: z.string().min(1, "Opis pozycji jest wymagany."),
        quantity: z.number().gt(0, "Ilość musi być większa od 0."),
        unit: z.enum(["szt", "godz", "km"]),
        netPrice: z.string().min(1, "Cena netto jest wymagana."),
        vatRate: z.enum(["23", "8", "5", "0", "zw", "np"]),
      }),
    )
    .min(1, "Dodaj co najmniej jedną pozycję."),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
