import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <AppShell
      title="Panel główny"
      subtitle="Najważniejsze informacje o fakturach i statusach płatności."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wide text-black/55 dark:text-white/55">Faktury w toku</p>
          <p className="mt-2 font-display text-3xl">12</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-black/55 dark:text-white/55">Opłacone w tym miesiącu</p>
          <p className="mt-2 font-display text-3xl">27</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-black/55 dark:text-white/55">Konto</p>
          <p className="mt-2 text-sm text-black/70 dark:text-white/70">{user.email}</p>
        </Card>
      </div>
    </AppShell>
  );
}
