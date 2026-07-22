"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/admin-api";
import {
  AdminCard,
  AdminPageHeader,
  Badge,
  EmptyState,
  ErrorBox,
  Field,
  SuccessBox,
  btnGhost,
  btnPrimary,
  inputClass,
} from "@/components/admin/ui";

type Partner = {
  id: string;
  name: string;
  url: string | null;
  isPublished: boolean;
  sortOrder: number;
};

export default function AdminParceirosPage() {
  const [items, setItems] = useState<Partner[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [editing, setEditing] = useState<Partner | null>(null);

  const load = async () => {
    try {
      setItems(await adminFetch<Partner[]>("/admin/partners"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk(null);
    try {
      await adminFetch("/admin/partners", {
        method: "POST",
        body: JSON.stringify({ name, url: url || undefined, isPublished: true }),
      });
      setName("");
      setUrl("");
      setOk("Parceiro adicionado.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  };

  const save = async () => {
    if (!editing) return;
    try {
      await adminFetch(`/admin/partners/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: editing.name,
          url: editing.url,
          isPublished: editing.isPublished,
        }),
      });
      setOk("Parceiro atualizado.");
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remover este parceiro do site?")) return;
    try {
      await adminFetch(`/admin/partners/${id}`, { method: "DELETE" });
      setOk("Parceiro removido.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Parceiros"
        description="Instituições e empresas exibidas na seção de padrinhos."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => {
              document.getElementById("novo-parceiro")?.scrollIntoView({ behavior: "smooth" });
              (document.querySelector("#novo-parceiro input") as HTMLInputElement | null)?.focus();
            }}
          >
            <Plus className="h-4 w-4" /> Adicionar parceiro
          </button>
        }
      />
      {error ? <ErrorBox text={error} /> : null}
      {ok ? <SuccessBox text={ok} /> : null}

      <AdminCard className="mb-6" id="novo-parceiro">
        <h2 className="mb-3 font-semibold text-slate-900">Adicionar parceiro</h2>
        <form onSubmit={(e) => void create(e)} className="grid gap-3 md:grid-cols-3">
          <Field label="Nome">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Site (opcional)">
            <input className={inputClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
          </Field>
          <div className="flex items-end">
            <button type="submit" className={btnPrimary}>
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </div>
        </form>
      </AdminCard>

      {!items.length ? (
        <EmptyState text="Nenhum parceiro cadastrado." />
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <AdminCard key={p.id} className="!p-4">
              {editing?.id === p.id ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Nome">
                    <input
                      className={inputClass}
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    />
                  </Field>
                  <Field label="Site">
                    <input
                      className={inputClass}
                      value={editing.url || ""}
                      onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                    />
                  </Field>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editing.isPublished}
                      onChange={(e) =>
                        setEditing({ ...editing, isPublished: e.target.checked })
                      }
                    />
                    Visível no site
                  </label>
                  <div className="flex gap-2">
                    <button type="button" className={btnPrimary} onClick={() => void save()}>
                      <Save className="h-4 w-4" /> Salvar
                    </button>
                    <button type="button" className={btnGhost} onClick={() => setEditing(null)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{p.name}</p>
                      <Badge tone={p.isPublished ? "green" : "slate"}>
                        {p.isPublished ? "No site" : "Oculto"}
                      </Badge>
                    </div>
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand hover:underline"
                      >
                        Abrir site do parceiro
                      </a>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className={btnGhost} onClick={() => setEditing(p)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className={btnGhost + " !text-rose-600"}
                      onClick={() => void remove(p.id)}
                    >
                      <Trash2 className="h-4 w-4" /> Remover
                    </button>
                  </div>
                </div>
              )}
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
