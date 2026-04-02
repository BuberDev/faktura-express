import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset hasła"
      description="Podaj adres e-mail, a wyślemy bezpieczny link resetujący."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
