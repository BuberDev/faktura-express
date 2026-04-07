import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { SupabaseBankAccountRepository } from "@/infrastructure/supabase/queries/bank-account-repository";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { BankAccountsManager } from "@/components/settings/bank-accounts-manager";

export const metadata = { title: "Rachunki bankowe | Faktura In" };

export default async function BankAccountsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [accounts, profile] = await Promise.all([
    new SupabaseBankAccountRepository().listByUser(user.id).catch(() => []),
    new SupabaseProfileRepository().getById(user.id).catch(() => null),
  ]);

  return (
    <AppShell title="Rachunki bankowe" subtitle="Zarządzaj kontami bankowymi, które pojawiają się na Twoich fakturach." userEmail={user.email} avatarUrl={profile?.avatarUrl} maxWidth="max-w-[900px]">
      <BankAccountsManager accounts={accounts} />
    </AppShell>
  );
}
