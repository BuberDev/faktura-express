import { z } from "zod";

const strongPasswordPattern = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

export const loginSchema = z.object({
  email: z.string().email("Podaj poprawny adres e-mail."),
  password: z.string().min(1, "Hasło jest wymagane."),
});

export const registerSchema = z
  .object({
    email: z.string().email("Podaj poprawny adres e-mail."),
    password: z
      .string()
      .regex(
        strongPasswordPattern,
        "Hasło musi mieć min. 8 znaków, 1 wielką literę i 1 znak specjalny.",
      ),
    confirmPassword: z.string().min(1, "Powtórz hasło."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Hasła muszą być identyczne.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Podaj poprawny adres e-mail."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
