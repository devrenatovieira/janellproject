const API_URL = import.meta.env.VITE_API_URL ?? "/api/v1";

export async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
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
          : "Erro ao enviar. Tente novamente.";
      return { error: msg, status: res.status };
    }
    return { data: json as T, status: res.status };
  } catch {
    return { error: "Falha de conexão com a API.", status: 0 };
  }
}

export { API_URL };
