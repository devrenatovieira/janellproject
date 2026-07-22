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

type Stat = {
  id: string;
  key: string;
  label: string;
  value: string | number | null;
  display: string | null;
  isPublished: boolean;
  notes: string | null;
};

export default function AdminEstatisticasPage() {
  const [items, setItems] = useState<Stat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ label: "", value: "", display: "" });

  const load = async () => {
    try {
      setItems(await adminFetch<Stat[]>("/admin/stats"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminFetch("/admin/stats", {
        method: "POST",
        body: JSON.stringify({
          label: form.label,
          value: form.value ? Number(form.value) : undefined,
          display: form.display || form.value || form.label,
          isPublished: true,
        }),
      });
      setOk("Número adicionado ao site.");
      setForm({ label: "", value: "", display: "" });
      setCreating(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  };

  const save = async (s: Stat) => {
    setOk(null);
    try {
      await adminFetch(`/admin/stats/${s.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          label: s.label,
          value: s.value === "" || s.value === null ? null : Number(s.value),
          display: s.display,
          isPublished: s.isPublished,
          notes: s.notes,
        }),
      });
      setOk("Números atualizados no site.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remover este número do site?")) return;
    try {
      await adminFetch(`/admin/stats/${id}`, { method: "DELETE" });
      setOk("Removido.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Números do site"
        description="Contadores da página inicial. Adicione ou edite quantos quiser."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => setCreating(true)}
          >
            <Plus className="h-4 w-4" /> Adicionar número
          </button>
        }
      />
      {error ? <ErrorBox text={error} /> : null}
      {ok ? <SuccessBox text={ok} /> : null}

      {creating ? (
        <AdminCard className="mb-6">
          <h2 className="mb-3 font-semibold text-slate-900">Novo indicador</h2>
          <form
            onSubmit={(e) => void create(e)}
            className="grid gap-3 md:grid-cols-3"
          >
            <Field label="Rótulo">
              <input
                className={inputClass}
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                required
                placeholder="Ex.: Famílias atendidas"
              />
            </Field>
            <Field label="Valor">
              <input
                className={inputClass}
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
            </Field>
            <Field label="Texto exibido">
              <input
                className={inputClass}
                value={form.display}
                onChange={(e) => setForm({ ...form, display: e.target.value })}
                placeholder="Ex.: +2000"
              />
            </Field>
            <div className="flex gap-2 md:col-span-3">
              <button type="submit" className={btnPrimary}>
                <Plus className="h-4 w-4" /> Salvar
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
        <EmptyState text="Nenhum número cadastrado." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((s) => (
            <AdminCard key={s.id}>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Indicador
                </p>
                <Badge tone={s.isPublished ? "green" : "slate"}>
                  {s.isPublished ? "Visível" : "Oculto"}
                </Badge>
              </div>
              <div className="space-y-3">
                <Field label="Rótulo">
                  <input
                    className={inputClass}
                    value={s.label}
                    onChange={(e) =>
                      setItems((arr) =>
                        arr.map((x) =>
                          x.id === s.id ? { ...x, label: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Valor numérico">
                  <input
                    className={inputClass}
                    type="number"
                    value={s.value ?? ""}
                    onChange={(e) =>
                      setItems((arr) =>
                        arr.map((x) =>
                          x.id === s.id ? { ...x, value: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Texto exibido">
                  <input
                    className={inputClass}
                    value={s.display || ""}
                    onChange={(e) =>
                      setItems((arr) =>
                        arr.map((x) =>
                          x.id === s.id ? { ...x, display: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </Field>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={s.isPublished}
                    onChange={(e) =>
                      setItems((arr) =>
                        arr.map((x) =>
                          x.id === s.id
                            ? { ...x, isPublished: e.target.checked }
                            : x,
                        ),
                      )
                    }
                  />
                  Mostrar no site
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={btnPrimary}
                    onClick={() => void save(s)}
                  >
                    <Save className="h-4 w-4" /> Salvar
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
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
