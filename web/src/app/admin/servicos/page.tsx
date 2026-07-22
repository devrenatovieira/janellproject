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

type Service = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  aboutDescription: string;
  fullDescription: string | null;
  tagline: string | null;
  capacity: number | null;
  isPublished: boolean;
};

const emptyNew = {
  name: "",
  shortDescription: "",
  aboutDescription: "",
  fullDescription: "",
  tagline: "",
  capacity: "",
};

export default function AdminServicosPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyNew);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const load = async () => {
    try {
      setItems(await adminFetch<Service[]>("/admin/services"));
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
      await adminFetch("/admin/services", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          shortDescription: form.shortDescription,
          aboutDescription: form.aboutDescription || form.shortDescription,
          fullDescription: form.fullDescription || undefined,
          tagline: form.tagline || undefined,
          capacity: form.capacity ? Number(form.capacity) : undefined,
          isPublished: true,
        }),
      });
      setOk("Serviço adicionado e publicado no site.");
      setForm(emptyNew);
      setCreating(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar");
    }
  };

  const save = async () => {
    if (!editing) return;
    setOk(null);
    try {
      await adminFetch(`/admin/services/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: editing.name,
          shortDescription: editing.shortDescription,
          aboutDescription: editing.aboutDescription,
          fullDescription: editing.fullDescription,
          tagline: editing.tagline,
          capacity: editing.capacity,
          isPublished: editing.isPublished,
        }),
      });
      setOk("Serviço atualizado.");
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remover este serviço do site?")) return;
    try {
      await adminFetch(`/admin/services/${id}`, { method: "DELETE" });
      setOk("Serviço removido.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Serviços"
        description="Serviços exibidos no site. Você pode adicionar, editar ou ocultar."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => {
              setCreating(true);
              setEditing(null);
            }}
          >
            <Plus className="h-4 w-4" /> Adicionar serviço
          </button>
        }
      />
      {error ? <ErrorBox text={error} /> : null}
      {ok ? <SuccessBox text={ok} /> : null}

      {creating ? (
        <AdminCard className="mb-6">
          <h2 className="mb-4 font-semibold text-slate-900">Novo serviço</h2>
          <form onSubmit={(e) => void create(e)} className="grid gap-3">
            <Field label="Nome">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Ex.: Atendimento psicossocial"
              />
            </Field>
            <Field label="Resumo (aparece nos cards)">
              <textarea
                className={inputClass}
                rows={3}
                value={form.shortDescription}
                onChange={(e) =>
                  setForm({ ...form, shortDescription: e.target.value })
                }
                required
              />
            </Field>
            <Field label="Descrição completa">
              <textarea
                className={inputClass}
                rows={4}
                value={form.aboutDescription}
                onChange={(e) =>
                  setForm({ ...form, aboutDescription: e.target.value })
                }
              />
            </Field>
            <Field label="Texto longo (opcional)">
              <textarea
                className={inputClass}
                rows={4}
                value={form.fullDescription}
                onChange={(e) =>
                  setForm({ ...form, fullDescription: e.target.value })
                }
              />
            </Field>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Frase de destaque">
                <input
                  className={inputClass}
                  value={form.tagline}
                  onChange={(e) =>
                    setForm({ ...form, tagline: e.target.value })
                  }
                />
              </Field>
              <Field label="Capacidade (opcional)">
                <input
                  className={inputClass}
                  type="number"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({ ...form, capacity: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="flex gap-2">
              <button type="submit" className={btnPrimary}>
                <Plus className="h-4 w-4" /> Salvar serviço
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
        <EmptyState text="Nenhum serviço cadastrado. Clique em Adicionar serviço." />
      ) : (
        <div className="space-y-3">
          {items.map((s) => (
            <AdminCard key={s.id}>
              {editing?.id === s.id ? (
                <div className="grid gap-3">
                  <Field label="Nome">
                    <input
                      className={inputClass}
                      value={editing.name}
                      onChange={(e) =>
                        setEditing({ ...editing, name: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Resumo (cards do site)">
                    <textarea
                      className={inputClass}
                      rows={3}
                      value={editing.shortDescription}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          shortDescription: e.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="Descrição completa">
                    <textarea
                      className={inputClass}
                      rows={5}
                      value={editing.aboutDescription}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          aboutDescription: e.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="Texto longo (opcional)">
                    <textarea
                      className={inputClass}
                      rows={5}
                      value={editing.fullDescription || ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          fullDescription: e.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="Frase de destaque">
                    <input
                      className={inputClass}
                      value={editing.tagline || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, tagline: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Capacidade (se houver)">
                    <input
                      className={inputClass}
                      type="number"
                      value={editing.capacity ?? ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          capacity: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                    />
                  </Field>
                  <label className="flex items-center gap-2 text-sm">
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
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">{s.name}</p>
                      <Badge tone={s.isPublished ? "green" : "slate"}>
                        {s.isPublished ? "No site" : "Oculto"}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                      {s.shortDescription}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={btnPrimary}
                      onClick={() => {
                        setEditing(s);
                        setCreating(false);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={btnGhost + " !text-rose-600"}
                      onClick={() => void remove(s.id)}
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
