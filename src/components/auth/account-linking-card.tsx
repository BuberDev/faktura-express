"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/infrastructure/supabase/browser-client";
import { hasSupabaseEnvironment } from "@/infrastructure/supabase/env";

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

export function AccountLinkingCard() {
  const [email, setEmail] = useState<string>("");
  const [providers, setProviders] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const hasGoogleIdentity = useMemo(() => providers.includes("google"), [providers]);
  const hasEmailIdentity = useMemo(() => providers.includes("email"), [providers]);

  async function refreshIdentities(): Promise<void> {
    if (!hasSupabaseEnvironment) {
      setStatus("Brakuje konfiguracji Supabase w zmiennych środowiskowych.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("Nie znaleziono zalogowanego użytkownika.");
      return;
    }

    setEmail(user.email ?? "");

    const { data, error } = await supabase.auth.getUserIdentities();

    if (error) {
      setStatus("Nie udało się pobrać metod logowania konta.");
      return;
    }

    const identityProviders = (data?.identities ?? []).map((identity) => identity.provider);
    setProviders(identityProviders);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshIdentities();
  }, []);

  async function onLinkGoogle(): Promise<void> {
    setIsLinkingGoogle(true);
    setStatus(null);

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.linkIdentity({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsLinkingGoogle(false);

    if (error) {
      setStatus("Nie udało się połączyć konta Google.");
      return;
    }
  }

  async function onSetPassword(): Promise<void> {
    if (!PASSWORD_REGEX.test(password)) {
      setStatus("Hasło musi mieć min. 8 znaków, 1 wielką literę i 1 znak specjalny.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("Hasła muszą być identyczne.");
      return;
    }

    setIsUpdatingPassword(true);
    setStatus(null);

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });

    setIsUpdatingPassword(false);

    if (error) {
      setStatus(
        "Nie udało się ustawić hasła. Jeśli trzeba, użyj opcji resetu hasła na ekranie logowania.",
      );
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setStatus("Hasło zostało ustawione. Możesz logować się e-mailem i hasłem.");
    await refreshIdentities();
  }

  return (
    <Card className="max-w-2xl space-y-4">
      <div>
        <h2 className="font-display text-2xl">Metody logowania i połączenie kont</h2>
        <p className="text-sm text-black/65 dark:text-white/65">
          Konto: <span className="font-medium">{email || "-"}</span>
        </p>
      </div>

      <div className="space-y-2 rounded-md border border-gold-subtle bg-gold/5 p-3 text-sm">
        <p>Połączone metody logowania:</p>
        <p className="font-medium">
          {providers.length > 0 ? providers.join(", ") : "Brak danych o metodach logowania."}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant={hasGoogleIdentity ? "ghost" : "outline"}
          disabled={hasGoogleIdentity || isLinkingGoogle}
          onClick={onLinkGoogle}
        >
          {hasGoogleIdentity
            ? "Google połączone"
            : isLinkingGoogle
              ? "Łączenie Google..."
              : "Połącz konto Google"}
        </Button>

        <Button type="button" variant="ghost" onClick={() => void refreshIdentities()}>
          Odśwież metody
        </Button>
      </div>

      <div className="space-y-3 rounded-md border border-[#E5E5E5] p-4 dark:border-[#262626]">
        <h3 className="font-display text-xl">Ustaw hasło dla logowania e-mail + hasło</h3>
        <p className="text-sm text-black/65 dark:text-white/65">
          Przydatne, jeśli konto było wcześniej używane tylko przez Google.
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <Input
            type="password"
            placeholder="Nowe hasło"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Input
            type="password"
            placeholder="Powtórz hasło"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>

        <Button type="button" onClick={onSetPassword} disabled={isUpdatingPassword}>
          {isUpdatingPassword ? "Zapisywanie hasła..." : hasEmailIdentity ? "Zmień hasło" : "Ustaw hasło"}
        </Button>
      </div>

      {status ? <p className="text-sm text-gold-dark">{status}</p> : null}
    </Card>
  );
}
