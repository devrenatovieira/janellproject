"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Loader2, Plus, Save, Trash2 } from "lucide-react";
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

type Doc = {
  id: string;
  title: string;
  type: string;
  year: number;
  organ: string | null;
  isPublished: boolean;
  downloadUrl: string | null;
  sizeBytes: number | null;
};

const TYPES = [
  { value: "PLANO_TRABALHO", label: "Plano de Trabalho" },
  { value: "TERMO_FOMENTO", label: "Termo de Fomento" },
  { value: "NOTA_EMPENHO", label: "Nota de Empenho" },
  { value: "TERMO_ADITIVO", label: "Termo Aditivo" },
  { value: "TERMO_APOSTILAMENTO", label: "Termo de Apostilamento" },
  { value: "DIARIO_OFICIAL", label: "Diário Oficial" },
  { value: "EMENDA_PARLAMENTAR", label: "Emenda Parlamentar" },
  { value: "RELATORIO_ATIVIDADES", label: "Relatório de Atividades" },
  { value: "BALANCO_ANUAL", label: "Balanço Anual" },
  { value: "PRESTACAO_CONTAS", label: "Prestação de Contas" },
  { value: "ALVARA_JUDICIAL", label: "Alvará Judicial" },
  { value: "TERMO_RESPONSABILIDADE", label: "Termo de Responsabilidade" },
  { value: "OUTRO", label: "Outro" },
];

const typeLabel = (t: string) => TYPES.find((x) => x.value === t)?.label || t;

export default function AdminDocumentosPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [year, setYear] = useState<string>("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [editing, setEditing] = useState<Doc | null>(null);
  const [uploading, setUploading] = useState(false);
  const [upload, setUpload] = useState({
    title: "",
    year: String(new Date().getFullYear()),
    type: "PLANO_TRABALHO",
    organ: "",
    file: null as File | null,
  });

  const years = useMemo(() => {
    const ys = [...new Set(docs.map((d) => d.year))].sort((a, b) => b - a);
    return ys;
  }, [docs]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (year) params.set("year", year);
      if (q) params.set("q", q);
      const data = await adminFetch<Doc[]>(
        `/admin/transparency/documents?${params.toString()}`,
      );
      setDocs(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [year]);

  const saveEdit = async () => {
    if (!editing) return;
    setError(null);
    setOk(null);
    try {
      await adminFetch(`/admin/transparency/documents/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: editing.title,
          type: editing.type,
          year: editing.year,
          organ: editing.organ,
          isPublished: editing.isPublished,
        }),
      });
      setOk("Documento atualizado.");
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remover este documento do site?")) return;
    try {
      await adminFetch(`/admin/transparency/documents/${id}`, {
        method: "DELETE",
      });
      setOk("Documento removido do site.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao remover");
    }
  };

  const doUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upload.file || !upload.title) {
      setError("Informe o título e selecione o PDF.");
      return;
    }
    setUploading(true);
    setError(null);
    setOk(null);
    try {
      const fd = new FormData();
      fd.append("title", upload.title);
      fd.append("year", upload.year);
      fd.append("type", upload.type);
      if (upload.organ) fd.append("organ", upload.organ);
      fd.append("file", upload.file);
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("lbjd_admin_token")
          : null;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3001/api/v1"}/admin/transparency/documents/upload`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: fd,
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Falha no envio");
      setOk("Documento enviado e publicado.");
      setUpload({
        title: "",
        year: String(new Date().getFullYear()),
        type: "PLANO_TRABALHO",
        organ: "",
        file: null,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no envio");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Documentos"
        description="Gerencie os arquivos do Portal da Transparência (planos, termos, balanços e relatórios)."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() =>
              document
                .getElementById("novo-documento")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            <Plus className="h-4 w-4" /> Adicionar documento
          </button>
        }
      />
      {error ? <ErrorBox text={error} /> : null}
      {ok ? <SuccessBox text={ok} /> : null}

      <AdminCard className="mb-6" id="novo-documento">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
          <Plus className="h-4 w-4" /> Enviar novo documento
        </h2>
        <form onSubmit={(e) => void doUpload(e)} className="grid gap-3 md:grid-cols-2">
          <Field label="Título">
            <input
              className={inputClass}
              value={upload.title}
              onChange={(e) => setUpload((u) => ({ ...u, title: e.target.value }))}
              placeholder="Ex.: Plano de Trabalho"
              required
            />
          </Field>
          <Field label="Ano">
            <input
              className={inputClass}
              type="number"
              value={upload.year}
              onChange={(e) => setUpload((u) => ({ ...u, year: e.target.value }))}
              required
            />
          </Field>
          <Field label="Tipo">
            <select
              className={inputClass}
              value={upload.type}
              onChange={(e) => setUpload((u) => ({ ...u, type: e.target.value }))}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Órgão (opcional)">
            <input
              className={inputClass}
              value={upload.organ}
              onChange={(e) => setUpload((u) => ({ ...u, organ: e.target.value }))}
              placeholder="Ex.: SEAS, SEMASC, FMS"
            />
          </Field>
          <Field label="Arquivo PDF">
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="block w-full text-sm"
              onChange={(e) =>
                setUpload((u) => ({ ...u, file: e.target.files?.[0] ?? null }))
              }
              required
            />
          </Field>
          <div className="flex items-end">
            <button type="submit" className={btnPrimary} disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Publicar documento
            </button>
          </div>
        </form>
      </AdminCard>

      <div className="mb-4 flex flex-wrap gap-2">
        <select
          className={inputClass + " max-w-[160px]"}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Todos os anos</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <input
          className={inputClass + " max-w-xs"}
          placeholder="Buscar por título…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void load()}
        />
        <button type="button" className={btnGhost} onClick={() => void load()}>
          Buscar
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Carregando documentos…</p>
      ) : !docs.length ? (
        <EmptyState text="Nenhum documento encontrado." />
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => (
            <AdminCard key={doc.id} className="!p-4">
              {editing?.id === doc.id ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Título">
                    <input
                      className={inputClass}
                      value={editing.title}
                      onChange={(e) =>
                        setEditing({ ...editing, title: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Ano">
                    <input
                      className={inputClass}
                      type="number"
                      value={editing.year}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          year: Number(e.target.value),
                        })
                      }
                    />
                  </Field>
                  <Field label="Tipo">
                    <select
                      className={inputClass}
                      value={editing.type}
                      onChange={(e) =>
                        setEditing({ ...editing, type: e.target.value })
                      }
                    >
                      {TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Órgão">
                    <input
                      className={inputClass}
                      value={editing.organ || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, organ: e.target.value })
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
                  <div className="flex gap-2 md:col-span-2">
                    <button type="button" className={btnPrimary} onClick={() => void saveEdit()}>
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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">{doc.title}</p>
                      <Badge tone={doc.isPublished ? "green" : "slate"}>
                        {doc.isPublished ? "Publicado" : "Oculto"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {typeLabel(doc.type)} · {doc.year}
                      {doc.organ ? ` · ${doc.organ}` : ""}
                      {doc.sizeBytes
                        ? ` · ${(doc.sizeBytes / (1024 * 1024)).toFixed(1)} MB`
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {doc.downloadUrl ? (
                      <a
                        href={doc.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={btnGhost}
                      >
                        <Download className="h-4 w-4" /> Baixar
                      </a>
                    ) : null}
                    <button
                      type="button"
                      className={btnGhost}
                      onClick={() => setEditing(doc)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={btnGhost + " !text-rose-600"}
                      onClick={() => void remove(doc.id)}
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
