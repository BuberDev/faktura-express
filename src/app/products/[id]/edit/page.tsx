import { redirect, notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { SupabaseProductRepository } from "@/infrastructure/supabase/queries/product-repository";
import { SupabaseProfileRepository } from "@/infrastructure/supabase/queries/profile-repository";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";
import { ProductForm } from "@/components/products/product-form";

export const metadata = { title: "Edytuj produkt | Faktura In" };

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [product, profile] = await Promise.all([
    new SupabaseProductRepository().getByIdForUser(params.id, user.id).catch(() => null),
    new SupabaseProfileRepository().getById(user.id).catch(() => null),
  ]);

  if (!product) notFound();

  return (
    <AppShell
      title="Edytuj produkt"
      subtitle={product.name}
      userEmail={user.email}
      avatarUrl={profile?.avatarUrl}
      maxWidth="max-w-[800px]"
    >
      <ProductForm mode="edit" product={product} />
    </AppShell>
  );
}
