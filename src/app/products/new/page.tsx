import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { ProductForm } from "@/components/products/product-form";

export const metadata = { title: "Nowy produkt | Faktura In" };

export default async function NewProductPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const profile = await new SupabaseProfileRepository().getById(user.id).catch(() => null);

  return (
    <AppShell
      title="Nowy produkt / usługa"
      subtitle="Dodaj pozycję do katalogu swoich produktów."
      userEmail={user.email}
      avatarUrl={profile?.avatarUrl}
      maxWidth="max-w-[800px]"
    >
      <ProductForm mode="create" />
    </AppShell>
  );
}
