"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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

type Video = {
  id: string;
  youtubeId: string;
  title: string;
  description: string | null;
  isPublished: boolean;
};

export default function AdminVideosPage() {
  const [items, setItems] = useState<Video[]>([]);
  const [title, setTitle] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const load = async () => {
    try {
      setItems(await adminFetch<Video[]>("/admin/videos"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const extractId = (value: string) => {
    const v = value.trim();
    const m = v.match(
      /(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{6,})|^(?:[\w-]{6,})$/,
    );
    return m?.[1] || m?.[0] || v;
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminFetch("/admin/videos", {
        method: "POST",
        body: JSON.stringify({
          title,
          youtubeId: extractId(youtubeId),
          isPublished: true,
        }),
      });
      setTitle("");
      setYoutubeId("");
      setOk("Vídeo adicionado ao site.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  };

  const toggle = async (v: Video) => {
    try {
      await adminFetch(`/admin/videos/${v.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isPublished: !v.isPublished }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remover este vídeo do site?")) return;
    try {
      await adminFetch(`/admin/videos/${id}`, { method: "DELETE" });
      setOk("Vídeo removido.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Vídeos"
        description="Galeria de vídeos do YouTube exibida no site."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() =>
              document.getElementById("novo-video")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Plus className="h-4 w-4" /> Adicionar vídeo
          </button>
        }
      />
      {error ? <ErrorBox text={error} /> : null}
      {ok ? <SuccessBox text={ok} /> : null}

      <AdminCard className="mb-6" id="novo-video">
        <form onSubmit={(e) => void create(e)} className="grid gap-3 md:grid-cols-3">
          <Field label="Título">
            <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Field>
          <Field label="Link ou código do YouTube">
            <input
              className={inputClass}
              value={youtubeId}
              onChange={(e) => setYoutubeId(e.target.value)}
              placeholder="Cole o link do vídeo"
              required
            />
          </Field>
          <div className="flex items-end">
            <button type="submit" className={btnPrimary}>
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </div>
        </form>
      </AdminCard>

      {!items.length ? (
        <EmptyState text="Nenhum vídeo cadastrado." />
      ) : (
        <div className="space-y-3">
          {items.map((v) => (
            <AdminCard key={v.id} className="!p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">{v.title}</p>
                    <Badge tone={v.isPublished ? "green" : "slate"}>
                      {v.isPublished ? "No site" : "Oculto"}
                    </Badge>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand hover:underline"
                  >
                    Assistir no YouTube
                  </a>
                </div>
                <div className="flex gap-2">
                  <button type="button" className={btnGhost} onClick={() => void toggle(v)}>
                    {v.isPublished ? "Ocultar" : "Publicar"}
                  </button>
                  <button
                    type="button"
                    className={btnGhost + " !text-rose-600"}
                    onClick={() => void remove(v.id)}
                  >
                    <Trash2 className="h-4 w-4" /> Remover
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
