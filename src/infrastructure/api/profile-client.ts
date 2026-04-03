"use client";

import {
  profileResponseSchema,
  type ProfilePatchPayload,
  type ProfileResponse,
} from "@/lib/schemas/profile";

export async function fetchCurrentProfile(): Promise<ProfileResponse> {
  const response = await fetch("/api/profile", {
    method: "GET",
    cache: "no-store",
  });

  const payload = (await response.json()) as unknown;

  if (!response.ok) {
    throw new Error("Nie udało się pobrać danych profilu.");
  }

  return profileResponseSchema.parse(payload);
}

export async function updateCurrentProfile(payload: ProfilePatchPayload): Promise<ProfileResponse> {
  const response = await fetch("/api/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = (await response.json()) as { error?: string } | unknown;

  if (!response.ok) {
    const errorMessage = (body as { error?: string })?.error;
    throw new Error(errorMessage || "Nie udało się zapisać zmian profilu.");
  }

  return profileResponseSchema.parse(body);
}
