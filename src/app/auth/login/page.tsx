import { LoginForm } from "@/components/auth/login-form";

interface LoginPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const errorParam = searchParams?.error;
  const initialFormError = Array.isArray(errorParam)
    ? (errorParam[0] ?? null)
    : (errorParam ?? null);

  return <LoginForm initialFormError={initialFormError} />;
}
