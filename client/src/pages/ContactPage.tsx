import { useState, type FormEvent } from "react";
import { contact } from "@/content/site";
import { apiPost } from "@/lib/api";
import { SimplePage } from "./SimplePage";

export function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const fd = new FormData(e.currentTarget);
    const body = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: true,
    };
    const res = await apiPost("/public/contact", body);
    setLoading(false);
    if (res.error) setStatus(res.error);
    else {
      setStatus("Mensagem enviada com sucesso. Obrigado!");
      e.currentTarget.reset();
    }
  }

  return (
    <SimplePage
      title="Contato"
      subtitle={`${contact.fullAddress} · ${contact.whatsappDisplay}`}
    >
      <div className="grid gap-10 md:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <input name="name" required placeholder="Nome" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
          <input name="email" required type="email" placeholder="E-mail" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
          <input name="phone" placeholder="Telefone" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
          <input name="subject" placeholder="Assunto" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
          <textarea name="message" required rows={5} placeholder="Mensagem" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-cyan-800 px-5 py-3 font-semibold text-white hover:bg-cyan-700 disabled:opacity-60"
          >
            {loading ? "Enviando…" : "Enviar mensagem"}
          </button>
          {status ? <p className="text-sm text-slate-600">{status}</p> : null}
        </form>
        <div className="space-y-4 text-slate-600">
          <p>
            Prefere falar agora? Use o WhatsApp oficial:
          </p>
          <a
            href={contact.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white"
          >
            Abrir WhatsApp
          </a>
          <p className="text-sm">{contact.email}</p>
        </div>
      </div>
    </SimplePage>
  );
}
