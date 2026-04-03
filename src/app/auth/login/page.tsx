import { LoginForm } from "@/components/auth/login-form";

interface LoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const errorParam = params.error;
  const initialFormError = Array.isArray(errorParam)
    ? (errorParam[0] ?? null)
    : (errorParam ?? null);

  return <LoginForm initialFormError={initialFormError} />;
}
