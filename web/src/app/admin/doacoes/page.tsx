"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import {
  AdminCard,
  AdminPageHeader,
  Badge,
  EmptyState,
  ErrorBox,
  SuccessBox,
  btnGhost,
  btnPrimary,
} from "@/components/admin/ui";

type Donation = {
  id: string;
  donorName: string;
  donorEmail: string;
  amountReais: string;
  status: string;
  provider: string;
  createdAt: string;
  message: string | null;
};

const statusLabel: Record<string, string> = {
  PENDING: "Aguardando",
  PAID: "Confirmada",
  FAILED: "Falhou",
  CANCELLED: "Cancelada",
  EXPIRED: "Expirada",
  REFUNDED: "Estornada",
};

const statusTone = (s: string) => {
  if (s === "PAID") return "green" as const;
  if (s === "PENDING") return "amber" as const;
  if (s === "FAILED" || s === "CANCELLED") return "rose" as const;
  return "slate" as const;
};

export default function AdminDoacoesPage() {
  const [items, setItems] = useState<Donation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const load = async () => {
    try {
      setItems(await adminFetch<Donation[]>("/admin/donations"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const setStatus = async (id: string, status: string) => {
    setOk(null);
    try {
      await adminFetch(`/admin/donations/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOk("Status da doação atualizado.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Doações"
        description="Acompanhe e confirme doações registradas pelo site."
      />
      {error ? <ErrorBox text={error} /> : null}
      {ok ? <SuccessBox text={ok} /> : null}
      {!items.length ? (
        <EmptyState text="Nenhuma doação registrada ainda." />
      ) : (
        <div className="space-y-3">
          {items.map((d) => (
            <AdminCard key={d.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">
                      R$ {d.amountReais}
                    </p>
                    <Badge tone={statusTone(d.status)}>
                      {statusLabel[d.status] || d.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-700">
                    {d.donorName} · {d.donorEmail}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {d.provider === "PIX" ? "PIX" : d.provider} ·{" "}
                    {new Date(d.createdAt).toLocaleString("pt-BR")}
                  </p>
                  {d.message ? (
                    <p className="mt-2 text-sm text-slate-600">{d.message}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {d.status !== "PAID" ? (
                    <button
                      type="button"
                      className={btnPrimary}
                      onClick={() => void setStatus(d.id, "PAID")}
                    >
                      Confirmar recebimento
                    </button>
                  ) : null}
                  {d.status === "PENDING" ? (
                    <button
                      type="button"
                      className={btnGhost}
                      onClick={() => void setStatus(d.id, "CANCELLED")}
                    >
                      Cancelar
                    </button>
                  ) : null}
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
