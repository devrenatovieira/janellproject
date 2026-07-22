"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/api";

export function FosterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk(null);
    setErr(null);
    if (!consent) {
      setErr("É necessário aceitar a Política de Privacidade (LGPD).");
      return;
    }
    setLoading(true);
    const res = await apiPost<{ message: string }>("/public/foster-families", {
      name,
      email,
      phone: phone || undefined,
      document: document || undefined,
      address: address || undefined,
      message: message || undefined,
    });
    setLoading(false);
    if (res.error) {
      setErr(res.error);
      return;
    }
    setOk(res.data?.message ?? "Inscrição recebida com sucesso.");
    setName("");
    setEmail("");
    setPhone("");
    setDocument("");
    setAddress("");
    setMessage("");
    setConsent(false);
  };

  return (
    <form
      onSubmit={(e) => void submit(e)}
      className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8"
      id="inscricao"
    >
      <h2 className="text-lg font-semibold text-slate-900">
        Quero me candidatar
      </h2>
      <p className="mt-1 text-sm text-muted">
        Preencha o formulário. A equipe técnica do {site.name} entrará em
        contato para orientação e próximas etapas.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          label="Nome completo"
          name="foster-name"
          value={name}
          onChange={setName}
          required
          className="sm:col-span-2"
        />
        <Field
          label="E-mail"
          name="foster-email"
          type="email"
          value={email}
          onChange={setEmail}
          required
        />
        <Field
          label="Telefone / WhatsApp"
          name="foster-phone"
          value={phone}
          onChange={setPhone}
        />
        <Field
          label="CPF (opcional)"
          name="foster-doc"
          value={document}
          onChange={setDocument}
        />
        <Field
          label="Endereço"
          name="foster-address"
          value={address}
          onChange={setAddress}
          className="sm:col-span-2"
        />
      </div>
      <div className="mt-4">
        <label
          className="text-sm font-medium text-slate-800"
          htmlFor="foster-message"
        >
          Mensagem / motivação
        </label>
        <textarea
          id="foster-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>
      <label className="mt-4 flex items-start gap-2 text-xs text-muted">
        <input
          type="checkbox"
          className="mt-0.5"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        Concordo com o tratamento dos dados conforme a Política de Privacidade
        (LGPD) do Lar Batista Janell Doyle.
      </label>
      {ok ? (
        <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {ok}
        </p>
      ) : null}
      {err ? (
        <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {err}
        </p>
      ) : null}
      <div className="mt-4">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Enviando…
            </>
          ) : (
            "Enviar inscrição"
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-slate-800" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}
