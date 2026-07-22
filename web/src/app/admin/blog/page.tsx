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

type Post = {
  id: string;
  slug: string;
  title: string;
  bodyMd: string;
  excerpt: string | null;
  status: string;
  publishedAt: string | null;
};

const emptyNew = { title: "", bodyMd: "", excerpt: "" };

export default function AdminBlogPage() {
  const [items, setItems] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyNew);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const load = async () => {
    try {
      setItems(await adminFetch<Post[]>("/admin/posts"));
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
      await adminFetch("/admin/posts", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          bodyMd: form.bodyMd,
          excerpt: form.excerpt || undefined,
          published: true,
        }),
      });
      setOk("Publicação criada e publicada no blog.");
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
      await adminFetch(`/admin/posts/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: editing.title,
          bodyMd: editing.bodyMd,
          excerpt: editing.excerpt,
          published: editing.status === "PUBLISHED",
        }),
      });
      setOk("Publicação salva.");
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remover esta publicação?")) return;
    try {
      await adminFetch(`/admin/posts/${id}`, { method: "DELETE" });
      setOk("Publicação removida.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Blog"
        description="Notícias e publicações do site. Adicione, edite ou oculte."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => {
              setCreating(true);
              setEditing(null);
            }}
          >
            <Plus className="h-4 w-4" /> Nova publicação
          </button>
        }
      />
      {error ? <ErrorBox text={error} /> : null}
      {ok ? <SuccessBox text={ok} /> : null}

      {creating ? (
        <AdminCard className="mb-6">
          <h2 className="mb-4 font-semibold text-slate-900">Nova publicação</h2>
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
        <EmptyState text="Nenhuma publicação. Clique em Nova publicação." />
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
                      rows={10}
                      value={editing.bodyMd}
                      onChange={(e) =>
                        setEditing({ ...editing, bodyMd: e.target.value })
                      }
                    />
                  </Field>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={editing.status === "PUBLISHED"}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          status: e.target.checked ? "PUBLISHED" : "DRAFT",
                        })
                      }
                    />
                    Publicada no site
                  </label>
                  <div className="flex gap-2">
                    <button type="button" className={btnPrimary} onClick={() => void save()}>
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
                      <h3 className="font-semibold text-slate-900">{p.title}</h3>
                      <Badge
                        tone={p.status === "PUBLISHED" ? "green" : "slate"}
                      >
                        {p.status === "PUBLISHED" ? "Publicada" : "Rascunho"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      /blog/{p.slug}
                      {p.publishedAt
                        ? ` · ${new Date(p.publishedAt).toLocaleDateString("pt-BR")}`
                        : ""}
                    </p>
                    {p.excerpt ? (
                      <p className="mt-2 text-sm text-slate-600">{p.excerpt}</p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={btnGhost}
                      onClick={() => setEditing(p)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={btnGhost}
                      onClick={() => void remove(p.id)}
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
