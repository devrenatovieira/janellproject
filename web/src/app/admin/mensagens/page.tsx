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

type Msg = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  handledAt: string | null;
  createdAt: string;
};

export default function AdminMensagensPage() {
  const [items, setItems] = useState<Msg[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await adminFetch<Msg[]>("/admin/messages"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const toggle = async (id: string, handled: boolean) => {
    setOk(null);
    try {
      await adminFetch(`/admin/messages/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ handled }),
      });
      setOk(handled ? "Mensagem marcada como atendida." : "Mensagem reaberta.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Mensagens"
        description="Contatos recebidos pelo formulário do site."
      />
      {error ? <ErrorBox text={error} /> : null}
      {ok ? <SuccessBox text={ok} /> : null}
      {loading ? (
        <p className="text-sm text-slate-500">Carregando…</p>
      ) : !items.length ? (
        <EmptyState text="Nenhuma mensagem recebida ainda." />
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <AdminCard key={m.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">{m.name}</p>
                    <Badge tone={m.handledAt ? "green" : "amber"}>
                      {m.handledAt ? "Atendida" : "Nova"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {m.email}
                    {m.phone ? ` · ${m.phone}` : ""}
                  </p>
                  {m.subject ? (
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      Assunto: {m.subject}
                    </p>
                  ) : null}
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {m.message}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    Recebida em {new Date(m.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <a href={`mailto:${m.email}`} className={btnGhost}>
                    Responder por e-mail
                  </a>
                  <button
                    type="button"
                    className={btnPrimary}
                    onClick={() => void toggle(m.id, !m.handledAt)}
                  >
                    {m.handledAt ? "Reabrir" : "Marcar como atendida"}
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
