import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  adminFetch,
  adminLogin,
  getAdminToken,
  setAdminToken,
} from "@/lib/admin-api";
import { site } from "@/content/site";

export function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dash, setDash] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const t = getAdminToken();
    setToken(t);
    if (t) {
      adminFetch<Record<string, unknown>>("/admin/dashboard")
        .then(setDash)
        .catch(() => setToken(null));
    }
  }, []);

  async function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await adminLogin(String(fd.get("email")), String(fd.get("password")));
      setToken(getAdminToken());
      const d = await adminFetch<Record<string, unknown>>("/admin/dashboard");
      setDash(d);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no login");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <form
          onSubmit={onLogin}
          className="w-full max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
        >
          <h1 className="text-2xl font-bold text-slate-900">Administração</h1>
          <p className="text-sm text-slate-500">{site.name}</p>
          <input
            name="email"
            type="email"
            required
            defaultValue="admin@larbatistamanaus.org.br"
            placeholder="E-mail"
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Senha"
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 py-3 font-semibold text-white"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Link to="/" className="block text-center text-sm text-slate-500">
            ← Voltar ao site
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Painel
            </p>
            <h1 className="text-lg font-bold text-slate-900">{site.name}</h1>
          </div>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm"
            onClick={() => {
              setAdminToken(null);
              setToken(null);
              setDash(null);
            }}
          >
            Sair
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="mt-2 text-slate-600">
          Login OK. API Express respondendo com JWT.
        </p>
        {dash ? (
          <pre className="mt-6 overflow-auto rounded-2xl bg-slate-900 p-4 text-xs text-cyan-100">
            {JSON.stringify(dash, null, 2)}
          </pre>
        ) : (
          <p className="mt-6 text-sm text-slate-500">Carregando métricas…</p>
        )}
        <Link to="/" className="mt-8 inline-block text-sm text-cyan-800">
          ← Ver site público
        </Link>
      </main>
    </div>
  );
}
