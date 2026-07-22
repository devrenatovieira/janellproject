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

type Member = {
  id: string;
  name: string;
  roleTitle: string;
  bio: string | null;
  isPublished: boolean;
};

export default function AdminEquipePage() {
  const [items, setItems] = useState<Member[]>([]);
  const [name, setName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const load = async () => {
    try {
      setItems(await adminFetch<Member[]>("/admin/team"));
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
      await adminFetch("/admin/team", {
        method: "POST",
        body: JSON.stringify({ name, roleTitle, bio: bio || undefined }),
      });
      setName("");
      setRoleTitle("");
      setBio("");
      setOk("Membro adicionado.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remover esta pessoa da equipe no site?")) return;
    try {
      await adminFetch(`/admin/team/${id}`, { method: "DELETE" });
      setOk("Removido.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Equipe"
        description="Pessoas apresentadas na área institucional do site."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() =>
              document.getElementById("nova-equipe")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Plus className="h-4 w-4" /> Adicionar pessoa
          </button>
        }
      />
      {error ? <ErrorBox text={error} /> : null}
      {ok ? <SuccessBox text={ok} /> : null}

      <AdminCard className="mb-6" id="nova-equipe">
        <form onSubmit={(e) => void create(e)} className="grid gap-3 md:grid-cols-2">
          <Field label="Nome">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Cargo">
            <input className={inputClass} value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} required />
          </Field>
          <Field label="Biografia (opcional)">
            <textarea className={inputClass} rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
          </Field>
          <div className="flex items-end">
            <button type="submit" className={btnPrimary}>
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </div>
        </form>
      </AdminCard>

      {!items.length ? (
        <EmptyState text="Nenhum membro cadastrado." />
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <AdminCard key={m.id} className="!p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{m.name}</p>
                    <Badge tone={m.isPublished ? "green" : "slate"}>
                      {m.isPublished ? "No site" : "Oculto"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{m.roleTitle}</p>
                  {m.bio ? (
                    <p className="mt-1 text-sm text-slate-500">{m.bio}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  className={btnGhost + " !text-rose-600"}
                  onClick={() => void remove(m.id)}
                >
                  <Trash2 className="h-4 w-4" /> Remover
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
