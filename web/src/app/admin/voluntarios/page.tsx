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

type App = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  interestAreas: string[];
  availability: string | null;
  message: string | null;
  status: string;
  createdAt: string;
};

const labels: Record<string, string> = {
  SUBMITTED: "Novo",
  UNDER_REVIEW: "Em análise",
  APPROVED: "Aprovado",
  REJECTED: "Recusado",
  WAITLIST: "Lista de espera",
  WITHDRAWN: "Desistência",
};

export default function AdminVoluntariosPage() {
  const [items, setItems] = useState<App[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const load = async () => {
    try {
      setItems(await adminFetch<App[]>("/admin/volunteers"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const setStatus = async (id: string, status: string) => {
    try {
      await adminFetch(`/admin/volunteers/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOk("Situação atualizada.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Voluntários"
        description="Inscrições de quem deseja doar tempo e talento."
      />
      {error ? <ErrorBox text={error} /> : null}
      {ok ? <SuccessBox text={ok} /> : null}
      {!items.length ? (
        <EmptyState text="Nenhuma inscrição de voluntário." />
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <AdminCard key={a.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">{a.name}</p>
                    <Badge
                      tone={
                        a.status === "APPROVED"
                          ? "green"
                          : a.status === "REJECTED"
                            ? "rose"
                            : "amber"
                      }
                    >
                      {labels[a.status] || a.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {a.email}
                    {a.phone ? ` · ${a.phone}` : ""}
                  </p>
                  {a.interestAreas?.length ? (
                    <p className="mt-1 text-sm text-slate-600">
                      Interesses: {a.interestAreas.join(", ")}
                    </p>
                  ) : null}
                  {a.availability ? (
                    <p className="mt-1 text-sm text-slate-600">
                      Disponibilidade: {a.availability}
                    </p>
                  ) : null}
                  {a.message ? (
                    <p className="mt-2 text-sm text-slate-700">{a.message}</p>
                  ) : null}
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(a.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={btnPrimary} onClick={() => void setStatus(a.id, "UNDER_REVIEW")}>
                    Em análise
                  </button>
                  <button type="button" className={btnGhost} onClick={() => void setStatus(a.id, "APPROVED")}>
                    Aprovar
                  </button>
                  <button type="button" className={btnGhost + " !text-rose-600"} onClick={() => void setStatus(a.id, "REJECTED")}>
                    Recusar
                  </button>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
