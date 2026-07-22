"use client";

import Image from "next/image";
import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { brand } from "@/content/media";
import { site } from "@/content/site";
import { adminLogin } from "@/lib/admin-api";
import { ErrorBox, btnPrimary, inputClass } from "@/components/admin/ui";

export function AdminLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("admin@larbatistamanaus.org.br");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminLogin(email, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form
        onSubmit={(e) => void onLogin(e)}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="relative h-12 w-12 overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200">
            <Image
              src={brand.logo}
              alt=""
              fill
              className="object-contain p-1"
              sizes="48px"
            />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Área administrativa
            </h1>
            <p className="text-xs text-slate-500">{site.name}</p>
          </div>
        </div>
        {error ? <ErrorBox text={error} /> : null}
        <label className="block text-sm font-medium text-slate-700">
          E-mail
          <input
            className={`${inputClass} mt-1.5`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-slate-700">
          Senha
          <input
            className={`${inputClass} mt-1.5`}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className={`${btnPrimary} mt-6 w-full`}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          Entrar
        </button>
      </form>
    </div>
  );
}
