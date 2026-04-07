"use server";

import { normalizeNip } from "@/core/use-cases/validate-nip";

// Mock GUS API integration based on public BIR 1.1 spec
// In production, this would use a SOAP request to GUS BIR1.1
export async function fetchCompanyByNipAction(nip: string) {
  const cleanNip = normalizeNip(nip);
  if (cleanNip.length !== 10) return { error: "Nieprawidłowy numer NIP." };

  try {
    // Simulating API call latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    // For demo/dev purposes, we return a mock object if NIP starts with 1
    // In a real scenario, we would use fetch() to a proxy or direct GUS API
    if (cleanNip.startsWith("123")) {
      return {
        data: {
          name: "PRZYKŁADOWA FIRMA S.A.",
          address: "ul. Marszałkowska 1, 00-001 Warszawa",
          nip: cleanNip,
        },
      };
    }

    // In search for real integration, usually a library or custom SOAP client is used.
    // Here we provide the structure for the USER to plug in their API key.
    return { error: "Nie znaleziono firmy o podanym numerze NIP w bazie GUS." };
  } catch (error) {
    return { error: "Błąd połączenia z bazą GUS." };
  }
}
