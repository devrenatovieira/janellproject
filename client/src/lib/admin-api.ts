const API_URL = import.meta.env.VITE_API_URL ?? "/api/v1";
const TOKEN_KEY = "lbjd_admin_token";

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setAdminToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.message ?? "Falha no login");
  }
  if (json.accessToken) setAdminToken(json.accessToken);
  return json;
}

export async function adminFetch<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = getAdminToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (res.status === 401) {
    setAdminToken(null);
    window.location.href = "/admin";
    throw new Error("Sessão expirada");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message ?? "Erro na requisição");
  return json as T;
}
