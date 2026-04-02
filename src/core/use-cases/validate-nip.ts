const NIP_WEIGHTS = [6, 5, 7, 2, 3, 4, 5, 6, 7] as const;

export function normalizeNip(input: string): string {
  return input.replace(/\D/g, "");
}

export function isValidNip(input: string): boolean {
  const normalizedNip = normalizeNip(input);

  if (!/^\d{10}$/.test(normalizedNip)) {
    return false;
  }

  const digits = normalizedNip.split("").map(Number);
  const checksum = NIP_WEIGHTS.reduce((accumulator, weight, index) => {
    return accumulator + digits[index] * weight;
  }, 0);

  const controlDigit = checksum % 11;

  return controlDigit !== 10 && controlDigit === digits[9];
}
