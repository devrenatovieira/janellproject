"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/api";

type DonationRow = {
  id: string;
  publicCode: string;
  status: string;
  type: string;
  amountReais: string;
  provider: string;
  message?: string | null;
  paidAt?: string | null;
  createdAt: string;
};

type LookupResult = {
  found: boolean;
  email: string;
  donorName: string | null;
  donations: DonationRow[];
  totals: {
    paidCents?: number;
    paidReais?: string;
    count: number;
    paidCount?: number;
  };
  message?: string;
};

const statusLabel: Record<string, string> = {
  PENDING: "Aguardando",
  PAID: "Confirmada",
  FAILED: "Falhou",
  CANCELLED: "Cancelada",
  EXPIRED: "Expirada",
  REFUNDED: "Estornada",
};

export function PadrinhoPanel() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setResult(null);
    setLoading(true);
    const res = await apiPost<LookupResult>("/public/padrinho/lookup", {
      email,
    });
    setLoading(false);
    if (res.error) {
      setErr(res.error);
      return;
    }
    setResult(res.data ?? null);
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={(e) => void submit(e)}
        className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8"
      >
        <h2 className="text-lg font-semibold text-slate-900">
          Consultar minhas doações
        </h2>
        <p className="mt-1 text-sm text-muted">
          Informe o e-mail usado no momento da doação para ver o histórico.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <Button type="submit" disabled={loading} className="shrink-0">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Consultando…
              </>
            ) : (
              "Consultar"
            )}
          </Button>
        </div>
        {err ? (
          <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {err}
          </p>
        ) : null}
      </form>

      {result ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {result.found ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted">Padrinho / doador</p>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {result.donorName || "Doador"}
                  </h3>
                  <p className="text-sm text-slate-600">{result.email}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                    Total confirmado
                  </p>
                  <p className="text-2xl font-semibold text-emerald-900">
                    R$ {result.totals.paidReais ?? "0,00"}
                  </p>
                  <p className="text-xs text-emerald-700">
                    {result.totals.paidCount ?? 0} doação(ões) paga(s) ·{" "}
                    {result.totals.count} no total
                  </p>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {result.donations.map((d) => (
                  <li
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        R$ {d.amountReais}
                      </p>
                      <p className="text-xs text-muted">
                        {new Date(d.createdAt).toLocaleDateString("pt-BR")} ·{" "}
                        {d.provider} · {d.type === "RECURRING" ? "Recorrente" : "Única"}
                      </p>
                      {d.message ? (
                        <p className="mt-1 text-xs text-slate-600">{d.message}</p>
                      ) : null}
                    </div>
                    <span
                      className={
                        d.status === "PAID"
                          ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800"
                          : "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800"
                      }
                    >
                      {statusLabel[d.status] || d.status}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-center">
              <Heart className="mx-auto h-10 w-10 text-rose-400" />
              <p className="mt-3 text-sm text-slate-700">
                {result.message ||
                  "Nenhuma doação encontrada com este e-mail."}
              </p>
              <Link
                href="/doacao"
                className="mt-4 inline-flex text-sm font-medium text-brand hover:underline"
              >
                Fazer uma doação
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
