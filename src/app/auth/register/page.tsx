import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Rejestracja"
      description="Utwórz darmowe konto i zacznij fakturować w 10 sekund."
    >
      <RegisterForm />
    </AuthShell>
  );
}
