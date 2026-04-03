import { z } from "zod";

import { isValidNip } from "@/core/use-cases/validate-nip";

const optionalTextField = z.string().trim().max(400);
const optionalNipField = z
  .string()
  .trim()
  .refine((value) => value.length === 0 || isValidNip(value), {
    message: "Podaj poprawny numer NIP (10 cyfr).",
  });

export const profilePatchSchema = z
  .object({
    companyName: optionalTextField.max(160).optional(),
    nip: optionalNipField.optional(),
    address: optionalTextField.max(500).optional(),
    bankAccount: optionalTextField.max(64).optional(),
    goldSubscription: z.boolean().optional(),
  })
  .strict();

export const profileResponseSchema = z.object({
  email: z.string().trim(),
  companyName: z.string(),
  nip: z.string(),
  address: z.string(),
  bankAccount: z.string(),
  goldSubscription: z.boolean(),
});

export const companySettingsSchema = z.object({
  companyName: optionalTextField.max(160),
  nip: optionalNipField,
  address: optionalTextField.max(500),
  bankAccount: optionalTextField.max(64),
});

export const profileSettingsSchema = z.object({
  email: z.string().trim(),
  goldSubscription: z.boolean(),
});

export type ProfilePatchPayload = z.infer<typeof profilePatchSchema>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type CompanySettingsValues = z.infer<typeof companySettingsSchema>;
export type ProfileSettingsValues = z.infer<typeof profileSettingsSchema>;
