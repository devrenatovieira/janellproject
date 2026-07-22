"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/api";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
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
    const res = await apiPost<{ message: string }>("/public/contact", {
      name,
      email,
      phone: phone || undefined,
      subject: subject || undefined,
      message,
      consent: true,
    });
    setLoading(false);
    if (res.error) {
      setErr(res.error);
      return;
    }
    setOk(res.data?.message ?? "Mensagem enviada com sucesso.");
    setName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
    setConsent(false);
  };

  return (
    <form
      onSubmit={(e) => void submit(e)}
      className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8"
    >
      <h2 className="text-lg font-semibold text-slate-900">Envie uma mensagem</h2>
      <p className="mt-1 text-sm text-muted">
        Preencha os campos e enviaremos sua mensagem à equipe do {site.name}.
      </p>
      <div className="mt-6 space-y-4">
        <Field label="Nome" name="name" value={name} onChange={setName} required />
        <Field
          label="E-mail"
          name="email"
          type="email"
          value={email}
          onChange={setEmail}
          required
        />
        <Field label="Telefone" name="phone" value={phone} onChange={setPhone} />
        <Field
          label="Assunto"
          name="subject"
          value={subject}
          onChange={setSubject}
        />
        <div>
          <label className="text-sm font-medium text-slate-800" htmlFor="message">
            Mensagem
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <label className="flex items-start gap-2 text-xs text-muted">
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
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {ok}
          </p>
        ) : null}
        {err ? (
          <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {err}
          </p>
        ) : null}
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Enviando…
            </>
          ) : (
            "Enviar"
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
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
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
