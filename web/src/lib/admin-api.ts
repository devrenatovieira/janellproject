const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window === "undefined"
    ? process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3001/api/v1"
    : "/api/v1");

export const ADMIN_TOKEN_KEY = "lbjd_admin_token";

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
  else localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function adminFetch<T>(
  path: string,
  init?: RequestInit & { formData?: FormData },
): Promise<T> {
  const token = getAdminToken();
  const headers = new Headers(init?.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!(init?.body instanceof FormData) && !headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (res.status === 401) {
    setAdminToken(null);
    if (typeof window !== "undefined" && !window.location.pathname.endsWith("/admin")) {
      window.location.href = "/admin";
    }
    throw new Error("Sessão expirada. Entre novamente.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof data?.message === "string"
        ? data.message
        : Array.isArray(data?.message)
          ? data.message.join(", ")
          : "Não foi possível concluir a ação.";
    throw new Error(msg);
  }
  return data as T;
}

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      typeof data?.message === "string" ? data.message : "E-mail ou senha incorretos.",
    );
  }
  setAdminToken(data.accessToken);
  return data as {
    accessToken: string;
    user: { name: string; email: string; roles: string[] };
  };
}

export { API_URL };
