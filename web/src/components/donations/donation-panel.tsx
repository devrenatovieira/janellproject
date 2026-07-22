"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Copy, Loader2 } from "lucide-react";
import { contact, donations as donationsStatic } from "@/content/site";
import { brand } from "@/content/media";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiGet, apiPost, type DonationConfig } from "@/lib/api";

export function DonationPanel() {
  const [amount, setAmount] = useState<number | "other">(100);
  const [custom, setCustom] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [config, setConfig] = useState<DonationConfig | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [intentMsg, setIntentMsg] = useState<string | null>(null);
  const [intentErr, setIntentErr] = useState<string | null>(null);

  useEffect(() => {
    void apiGet<DonationConfig>("/public/donations/config").then((data) => {
      if (data) setConfig(data);
    });
  }, []);

  const accounts =
    config?.accounts?.map((a) => ({
      agency: a.agency,
      account: a.account,
      pixKeyType: a.pixKeyType,
      pixKey: a.pixKey,
      pixKeyDisplay:
        a.pixKeyType.toUpperCase() === "CNPJ" && a.pixKey.length === 14
          ? a.pixKey.replace(
              /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
              "$1.$2.$3/$4-$5",
            )
          : a.pixKey,
    })) ?? donationsStatic.accounts;

  const quickAmounts = config?.quickAmounts ?? donationsStatic.quickAmounts;
  const partnerUrl = config?.partnerUrl ?? donationsStatic.partnerUrl;

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  };

  const amountCents = (() => {
    if (amount === "other") {
      const n = Number(custom);
      return Number.isFinite(n) ? Math.round(n * 100) : 0;
    }
    return amount * 100;
  })();

  const registerIntent = async () => {
    setIntentErr(null);
    setIntentMsg(null);
    if (!name.trim() || !email.trim()) {
      setIntentErr("Informe nome e e-mail para registrar a doação.");
      return;
    }
    if (amountCents < 100) {
      setIntentErr("Informe um valor válido (mínimo R$ 1,00).");
      return;
    }
    setSubmitting(true);
    const res = await apiPost<{
      publicCode: string;
      status: string;
      message: string;
    }>("/public/donations/intent", {
      amountCents,
      provider: "PIX",
      type: "ONE_TIME",
      donor: { name: name.trim(), email: email.trim() },
    });
    setSubmitting(false);
    if (res.error) {
      setIntentErr(res.error);
      return;
    }
    setIntentMsg(
      res.data?.message ??
        `Doação registrada (${res.data?.publicCode}). Conclua pelo PIX oficial abaixo.`,
    );
  };

  return (
    <div className="container-site grid gap-10 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-start gap-3">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200">
            <Image
              src={brand.logo}
              alt="Logo Lar Batista Janell Doyle"
              fill
              className="object-contain p-1"
              sizes="48px"
            />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {donationsStatic.headline}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Lar Batista Janell Doyle — {donationsStatic.instructions}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-md">
            <Image
              src={brand.pixQr}
              alt="QR Code PIX oficial do Lar Batista Janell Doyle"
              width={260}
              height={260}
              className="h-auto w-[220px] md:w-[260px]"
            />
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm font-medium text-slate-800">
            Valores rápidos (R$)
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickAmounts.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setAmount(v)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition",
                  amount === v
                    ? "border-accent bg-accent text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300",
                )}
              >
                {v}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAmount("other")}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                amount === "other"
                  ? "border-accent bg-accent text-white"
                  : "border-slate-200 bg-slate-50 text-slate-700",
              )}
            >
              Outro
            </button>
          </div>
          {amount === "other" ? (
            <input
              type="number"
              min={1}
              placeholder="Valor em R$"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          ) : null}
        </div>

        <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-800">
            Seus dados (opcional)
          </p>
          <input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <Button
            type="button"
            variant="primary"
            className="w-full"
            disabled={submitting}
            onClick={() => void registerIntent()}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Enviando…
              </>
            ) : (
              "Continuar doação"
            )}
          </Button>
          {intentMsg ? (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
              {intentMsg}
            </p>
          ) : null}
          {intentErr ? (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-800">
              {intentErr}
            </p>
          ) : null}
        </div>

        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-900">
          Preferencialmente, doe via PIX usando o QR Code ou as chaves oficiais
          do Lar Batista Janell Doyle listadas ao lado.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={partnerUrl} external variant="outline">
            {donationsStatic.partnerLabel}
          </ButtonLink>
          <ButtonLink href={contact.whatsappUrl} external variant="primary">
            Falar no WhatsApp
          </ButtonLink>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-brand/20 bg-brand-soft/50 p-5">
          <p className="text-sm font-semibold text-brand-dark">
            Contas para doação — Lar Batista Janell Doyle
          </p>
          <p className="mt-1 text-xs text-muted">
            CNPJ 63.692.354/0001-64
          </p>
        </div>
        {accounts.map((acc, i) => (
          <div
            key={`${acc.account}-${i}`}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              Conta {i + 1}
            </p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted">Agência</dt>
                <dd className="font-semibold text-slate-900">{acc.agency}</dd>
              </div>
              <div>
                <dt className="text-muted">Conta corrente</dt>
                <dd className="font-semibold text-slate-900">{acc.account}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted">Chave PIX ({acc.pixKeyType})</dt>
                <dd className="mt-1 flex flex-wrap items-center gap-2">
                  <code className="break-all rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-900">
                    {acc.pixKeyDisplay}
                  </code>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => copy(acc.pixKey, acc.pixKey)}
                  >
                    {copied === acc.pixKey ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copiar
                      </>
                    )}
                  </Button>
                </dd>
              </div>
            </dl>
          </div>
        ))}
        <p className="text-xs text-muted">{donationsStatic.note}</p>
      </div>
    </div>
  );
}
