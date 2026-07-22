"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { adminFetch, getAdminToken } from "@/lib/admin-api";
import {
  AdminCard,
  AdminPageHeader,
  ErrorBox,
  StatPill,
  btnPrimary,
} from "@/components/admin/ui";

type Dashboard = {
  visits: number;
  adminLogins: number;
  lastAdminLogin: string | null;
  pendingDonations: number;
  paidDonations: number;
  pendingVolunteers: number;
  pendingFoster: number;
  openMessages: number;
  publishedServices: number;
  publishedDocuments: number;
  publishedPartners: number;
  publishedVideos: number;
  topPages: Array<{ name: string; count: number }>;
};

export default function AdminHomePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dash, setDash] = useState<Dashboard | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(!!getAdminToken());
  }, []);

  useEffect(() => {
    if (!ready) return;
    void load();
  }, [ready]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminFetch<Dashboard>("/admin/dashboard");
      setDash(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar");
      setDash(null);
    } finally {
      setLoading(false);
    }
  };

  // Login is handled by AdminShell when not authenticated
  if (!ready && typeof window !== "undefined" && !getAdminToken()) {
    return null;
  }

  return (
    <div>
      <AdminPageHeader
        title="Painel"
        description="Visão geral do site e das atividades recentes."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => void load()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Atualizar
          </button>
        }
      />
      {error ? <ErrorBox text={error} /> : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatPill label="Visitas no site" value={dash?.visits ?? "—"} tone="brand" />
        <StatPill
          label="Acessos de administradores"
          value={dash?.adminLogins ?? "—"}
        />
        <StatPill
          label="Mensagens novas"
          value={dash?.openMessages ?? "—"}
          tone="warn"
        />
        <StatPill
          label="Doações aguardando"
          value={dash?.pendingDonations ?? "—"}
          tone="danger"
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatPill
          label="Voluntários pendentes"
          value={dash?.pendingVolunteers ?? "—"}
          tone="warn"
        />
        <StatPill
          label="Família Acolhedora (fila)"
          value={dash?.pendingFoster ?? "—"}
          tone="warn"
        />
        <StatPill
          label="Documentos publicados"
          value={dash?.publishedDocuments ?? "—"}
          tone="ok"
        />
        <StatPill
          label="Doações confirmadas"
          value={dash?.paidDonations ?? "—"}
          tone="ok"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <AdminCard>
          <h2 className="font-semibold text-slate-900">Atalhos</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              { href: "/admin/mensagens", label: "Responder mensagens" },
              { href: "/admin/documentos", label: "Gerenciar documentos" },
              { href: "/admin/doacoes", label: "Ver doações" },
              { href: "/admin/paginas", label: "Editar páginas" },
              { href: "/admin/servicos", label: "Editar serviços" },
              { href: "/admin/parceiros", label: "Editar parceiros" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-medium text-slate-700 transition hover:border-brand/30 hover:bg-brand-soft/40"
              >
                {a.label}
              </Link>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-semibold text-slate-900">
            Páginas mais visitadas
          </h2>
          {!dash?.topPages?.length ? (
            <p className="mt-4 text-sm text-slate-500">
              Ainda não há visitas registradas.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {dash.topPages.map((p) => (
                <li
                  key={p.name}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-slate-800">{p.name}</span>
                  <span className="font-semibold tabular-nums text-brand">
                    {p.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {dash?.lastAdminLogin ? (
            <p className="mt-4 text-xs text-slate-400">
              Último acesso administrativo:{" "}
              {new Date(dash.lastAdminLogin).toLocaleString("pt-BR")}
            </p>
          ) : null}
        </AdminCard>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <StatPill
          label="Serviços no site"
          value={dash?.publishedServices ?? "—"}
        />
        <StatPill
          label="Parceiros no site"
          value={dash?.publishedPartners ?? "—"}
        />
        <StatPill label="Vídeos no site" value={dash?.publishedVideos ?? "—"} />
      </div>
    </div>
  );
}
