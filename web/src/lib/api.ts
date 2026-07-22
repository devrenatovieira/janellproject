/**
 * Em produção no mesmo domínio: NEXT_PUBLIC_API_URL=/api/v1 (rewrite → Nest).
 * Em dev local: http://127.0.0.1:3001/api/v1
 */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window === "undefined"
    ? process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3001/api/v1"
    : "/api/v1");

export async function apiGet<T>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  try {
    // force-cache keeps pages static on Vercel Hobby (avoids 1 function per route)
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      cache: "force-cache",
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function apiPost<T>(
  path: string,
  body: unknown,
): Promise<{ data?: T; error?: string; status: number }> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg =
        typeof json?.message === "string"
          ? json.message
          : Array.isArray(json?.message)
            ? json.message.join(", ")
            : "Não foi possível enviar.";
      return { error: msg, status: res.status };
    }
    return { data: json as T, status: res.status };
  } catch {
    return { error: "API indisponível. Tente novamente em instantes.", status: 0 };
  }
}

export type DonationConfig = {
  quickAmounts: number[];
  currency: string;
  providers: Record<string, boolean>;
  accounts: Array<{
    id: string;
    agency: string;
    account: string;
    accountType?: string | null;
    pixKeyType: string;
    pixKey: string;
    bankName?: string | null;
  }>;
  partnerUrl?: string;
};

export type TransparencyYear = {
  id: string;
  year: number;
  title?: string | null;
  _count?: { documents: number };
};

export type ApiService = {
  slug: string;
  name: string;
  alsoKnownAs: string[];
  shortDescription: string;
  aboutDescription: string;
  fullDescription?: string | null;
  tagline?: string | null;
  capacity?: number | null;
  eligibility: string[];
  requiredDocuments: string[];
};

export { API_URL };
