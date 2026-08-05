export function isValidUsername(username: string) {
  return /^[a-z0-9_.]{3,30}$/.test(username);
}

export function isValidUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function formatBRL(amount: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
}

export function last14DaysWindow() {
  const now = Date.now();
  const sinceIso = new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString();
  const days = Array.from({ length: 14 }, (_, i) =>
    new Date(now - (13 - i) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  );
  return { sinceIso, days };
}
