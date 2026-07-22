"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/api";

const INTEREST_OPTIONS = [
  "Acolhimento e cuidado",
  "Educação e reforço escolar",
  "Eventos e campanhas",
  "Comunicação e redes sociais",
  "Administrativo",
  "Manutenção e serviços gerais",
  "Outro",
];

export function VolunteerForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Manaus");
  const [state, setState] = useState("AM");
  const [interests, setInterests] = useState<string[]>([]);
  const [availability, setAvailability] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk(null);
    setErr(null);
    if (!consent) {
      setErr("É necessário aceitar a Política de Privacidade (LGPD).");
      return;
    }
    setLoading(true);
    const res = await apiPost<{ message: string }>("/public/volunteers", {
      name,
      email,
      phone: phone || undefined,
      document: document || undefined,
      birthDate: birthDate || undefined,
      address: address || undefined,
      city: city || undefined,
      state: state || undefined,
      interestAreas: interests,
      availability: availability || undefined,
      message: message || undefined,
    });
    setLoading(false);
    if (res.error) {
      setErr(res.error);
      return;
    }
    setOk(res.data?.message ?? "Cadastro recebido com sucesso.");
    setName("");
    setEmail("");
    setPhone("");
    setDocument("");
    setBirthDate("");
    setAddress("");
    setCity("Manaus");
    setState("AM");
    setInterests([]);
    setAvailability("");
    setMessage("");
    setConsent(false);
  };

  return (
    <form
      onSubmit={(e) => void submit(e)}
      className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8"
    >
      <h2 className="text-lg font-semibold text-slate-900">
        Formulário de voluntariado
      </h2>
      <p className="mt-1 text-sm text-muted">
        Preencha seus dados. A equipe do {site.name} entrará em contato.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          label="Nome completo"
          name="name"
          value={name}
          onChange={setName}
          required
          className="sm:col-span-2"
        />
        <Field
          label="E-mail"
          name="email"
          type="email"
          value={email}
          onChange={setEmail}
          required
        />
        <Field
          label="Telefone / WhatsApp"
          name="phone"
          value={phone}
          onChange={setPhone}
        />
        <Field
          label="CPF (opcional)"
          name="document"
          value={document}
          onChange={setDocument}
        />
        <Field
          label="Data de nascimento"
          name="birthDate"
          type="date"
          value={birthDate}
          onChange={setBirthDate}
        />
        <Field
          label="Endereço"
          name="address"
          value={address}
          onChange={setAddress}
          className="sm:col-span-2"
        />
        <Field label="Cidade" name="city" value={city} onChange={setCity} />
        <Field label="UF" name="state" value={state} onChange={setState} />
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-800">Áreas de interesse</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((item) => {
            const active = interests.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleInterest(item)}
                className={
                  active
                    ? "rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-white"
                    : "rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand/40"
                }
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label
            className="text-sm font-medium text-slate-800"
            htmlFor="availability"
          >
            Disponibilidade
          </label>
          <input
            id="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            placeholder="Ex.: sábados de manhã, 4h por semana"
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div>
          <label
            className="text-sm font-medium text-slate-800"
            htmlFor="vol-message"
          >
            Mensagem
          </label>
          <textarea
            id="vol-message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Conte um pouco sobre você e como gostaria de ajudar."
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
            "Enviar cadastro"
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
