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

type Testimonial = {
  id: string;
  authorName: string;
  authorRole: string | null;
  content: string;
  isPublished: boolean;
  sortOrder: number;
};

const emptyNew = {
  authorName: "",
  authorRole: "",
  content: "",
};

export default function AdminDepoimentosPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyNew);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const load = async () => {
    try {
      setItems(await adminFetch<Testimonial[]>("/admin/testimonials"));
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
    setError(null);
    try {
      await adminFetch("/admin/testimonials", {
        method: "POST",
        body: JSON.stringify({
          authorName: form.authorName,
          authorRole: form.authorRole || undefined,
          content: form.content,
          isPublished: true,
        }),
      });
      setOk("Depoimento adicionado e publicado.");
      setForm(emptyNew);
      setCreating(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  };

  const save = async () => {
    if (!editing) return;
    setOk(null);
    try {
      await adminFetch(`/admin/testimonials/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          authorName: editing.authorName,
          authorRole: editing.authorRole,
          content: editing.content,
          isPublished: editing.isPublished,
          sortOrder: editing.sortOrder,
        }),
      });
      setOk("Depoimento atualizado.");
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remover este depoimento?")) return;
    try {
      await adminFetch(`/admin/testimonials/${id}`, { method: "DELETE" });
      setOk("Depoimento removido.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Depoimentos"
        description="Depoimentos exibidos na página inicial. Use apenas textos oficiais ou autorizados."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => {
              setCreating(true);
              setEditing(null);
            }}
          >
            <Plus className="h-4 w-4" /> Adicionar depoimento
          </button>
        }
      />
      {error ? <ErrorBox text={error} /> : null}
      {ok ? <SuccessBox text={ok} /> : null}

      {creating ? (
        <AdminCard className="mb-6">
          <h2 className="mb-4 font-semibold text-slate-900">Novo depoimento</h2>
          <form onSubmit={(e) => void create(e)} className="space-y-3">
            <Field label="Nome">
              <input
                className={inputClass}
                value={form.authorName}
                onChange={(e) =>
                  setForm({ ...form, authorName: e.target.value })
                }
                required
              />
            </Field>
            <Field label="Cargo / função">
              <input
                className={inputClass}
                value={form.authorRole}
                onChange={(e) =>
                  setForm({ ...form, authorRole: e.target.value })
                }
              />
            </Field>
            <Field label="Depoimento">
              <textarea
                className={inputClass}
                rows={5}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </Field>
            <div className="flex gap-2">
              <button type="submit" className={btnPrimary}>
                <Plus className="h-4 w-4" /> Publicar
              </button>
              <button
                type="button"
                className={btnGhost}
                onClick={() => setCreating(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </AdminCard>
      ) : null}

      {!items.length && !creating ? (
        <EmptyState text="Nenhum depoimento. Clique em Adicionar depoimento." />
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <AdminCard key={t.id}>
              {editing?.id === t.id ? (
                <div className="space-y-3">
                  <Field label="Nome">
                    <input
                      className={inputClass}
                      value={editing.authorName}
                      onChange={(e) =>
                        setEditing({ ...editing, authorName: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Cargo / função">
                    <input
                      className={inputClass}
                      value={editing.authorRole || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, authorRole: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Depoimento">
                    <textarea
                      className={inputClass}
                      rows={5}
                      value={editing.content}
                      onChange={(e) =>
                        setEditing({ ...editing, content: e.target.value })
                      }
                    />
                  </Field>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={editing.isPublished}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          isPublished: e.target.checked,
                        })
                      }
                    />
                    Visível no site
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={btnPrimary}
                      onClick={() => void save()}
                    >
                      <Save className="h-4 w-4" /> Salvar
                    </button>
                    <button
                      type="button"
                      className={btnGhost}
                      onClick={() => setEditing(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {t.authorName}
                      </h3>
                      <Badge tone={t.isPublished ? "green" : "slate"}>
                        {t.isPublished ? "Publicado" : "Oculto"}
                      </Badge>
                    </div>
                    {t.authorRole ? (
                      <p className="text-xs text-slate-500">{t.authorRole}</p>
                    ) : null}
                    <p className="mt-2 text-sm text-slate-700">“{t.content}”</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={btnGhost}
                      onClick={() => setEditing(t)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={btnGhost}
                      onClick={() => void remove(t.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
