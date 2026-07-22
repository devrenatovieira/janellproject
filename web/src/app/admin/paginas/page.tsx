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

type Page = {
  id: string;
  slug: string;
  title: string;
  bodyMd: string;
  excerpt: string | null;
  publishedAt: string | null;
};

const pageNames: Record<string, string> = {
  sobre: "Quem Somos",
  "nossa-historia": "Nossa História",
};

export default function AdminPaginasPage() {
  const [items, setItems] = useState<Page[]>([]);
  const [editing, setEditing] = useState<Page | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", bodyMd: "", excerpt: "" });
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const load = async () => {
    try {
      setItems(await adminFetch<Page[]>("/admin/pages"));
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
      await adminFetch("/admin/pages", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          bodyMd: form.bodyMd,
          excerpt: form.excerpt || undefined,
          published: true,
        }),
      });
      setOk("Página criada e publicada.");
      setForm({ title: "", bodyMd: "", excerpt: "" });
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
      await adminFetch(`/admin/pages/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: editing.title,
          bodyMd: editing.bodyMd,
          excerpt: editing.excerpt,
          published: !!editing.publishedAt,
        }),
      });
      setOk("Página salva.");
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remover esta página?")) return;
    try {
      await adminFetch(`/admin/pages/${id}`, { method: "DELETE" });
      setOk("Página removida.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Páginas"
        description="Textos institucionais do site. Páginas novas ficam disponíveis em /p/endereço-da-página."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => {
              setCreating(true);
              setEditing(null);
            }}
          >
            <Plus className="h-4 w-4" /> Adicionar página
          </button>
        }
      />
      {error ? <ErrorBox text={error} /> : null}
      {ok ? <SuccessBox text={ok} /> : null}

      {creating ? (
        <AdminCard className="mb-6">
          <h2 className="mb-4 font-semibold text-slate-900">Nova página</h2>
          <form onSubmit={(e) => void create(e)} className="space-y-3">
            <Field label="Título">
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </Field>
            <Field label="Resumo">
              <input
                className={inputClass}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
            </Field>
            <Field label="Conteúdo">
              <textarea
                className={inputClass}
                rows={10}
                value={form.bodyMd}
                onChange={(e) => setForm({ ...form, bodyMd: e.target.value })}
                required
              />
            </Field>
            <div className="flex gap-2">
              <button type="submit" className={btnPrimary}>
                <Plus className="h-4 w-4" /> Publicar página
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
        <EmptyState text="Nenhuma página. Clique em Adicionar página." />
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <AdminCard key={p.id}>
              {editing?.id === p.id ? (
                <div className="space-y-3">
                  <Field label="Título">
                    <input
                      className={inputClass}
                      value={editing.title}
                      onChange={(e) =>
                        setEditing({ ...editing, title: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Resumo">
                    <input
                      className={inputClass}
                      value={editing.excerpt || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, excerpt: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Conteúdo">
                    <textarea
                      className={inputClass}
                      rows={12}
                      value={editing.bodyMd}
                      onChange={(e) =>
                        setEditing({ ...editing, bodyMd: e.target.value })
                      }
                    />
                  </Field>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!editing.publishedAt}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          publishedAt: e.target.checked
                            ? new Date().toISOString()
                            : null,
                        })
                      }
                    />
                    Publicada no site
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
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">
                        {pageNames[p.slug] || p.title}
                      </p>
                      <Badge tone={p.publishedAt ? "green" : "slate"}>
                        {p.publishedAt ? "Publicada" : "Rascunho"}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Endereço no site: /p/{p.slug}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                      {p.excerpt || p.bodyMd}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={btnPrimary}
                      onClick={() => {
                        setEditing(p);
                        setCreating(false);
                      }}
                    >
                      Editar texto
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
