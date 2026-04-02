import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Logowanie"
      description="Zaloguj się, aby wystawiać faktury i zarządzać klientami."
    >
      <LoginForm />
    </AuthShell>
  );
}
