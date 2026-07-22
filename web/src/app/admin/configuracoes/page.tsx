"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { adminFetch } from "@/lib/admin-api";
import {
  AdminCard,
  AdminPageHeader,
  ErrorBox,
  Field,
  SuccessBox,
  btnPrimary,
  inputClass,
} from "@/components/admin/ui";
import { contact, site } from "@/content/site";

type Setting = {
  id: string;
  key: string;
  value: unknown;
  isPublic: boolean;
};

export default function AdminConfigPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState<string>(contact.whatsappDisplay);
  const [email, setEmail] = useState<string>(contact.email);
  const [address, setAddress] = useState<string>(contact.fullAddress);

  useEffect(() => {
    void (async () => {
      try {
        const rows = await adminFetch<Setting[]>("/admin/settings");
        setSettings(rows);
        const contactSetting = rows.find((r) => r.key === "contact");
        if (contactSetting?.value && typeof contactSetting.value === "object") {
          const c = contactSetting.value as Record<string, string>;
          if (c.email) setEmail(c.email);
          if (c.whatsapp_display) setWhatsapp(c.whatsapp_display);
          if (c.full_address || c.address_street) {
            setAddress(
              c.full_address ||
                `${c.address_street}, ${c.city}/${c.state} ${c.postal_code || ""}`,
            );
          }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro");
      }
    })();
  }, []);

  const saveContact = async () => {
    setOk(null);
    try {
      const digits = whatsapp.replace(/\D/g, "");
      const e164 = digits.startsWith("55") ? digits : `55${digits}`;
      await adminFetch("/admin/settings", {
        method: "POST",
        body: JSON.stringify({
          key: "contact",
          isPublic: true,
          value: {
            email,
            whatsapp_display: whatsapp,
            whatsapp_e164: e164,
            whatsapp_url: `https://api.whatsapp.com/send?phone=${e164}&text=${encodeURIComponent("Olá. Quero saber mais sobre o Janell Doyle!")}`,
            full_address: address,
            address_street: address,
            city: site.city,
            state: site.state,
          },
        }),
      });
      setOk("Contatos atualizados.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Configurações"
        description="Dados gerais de contato e informações exibidas no site."
      />
      {error ? <ErrorBox text={error} /> : null}
      {ok ? <SuccessBox text={ok} /> : null}

      <AdminCard className="max-w-2xl">
        <h2 className="mb-4 font-semibold text-slate-900">Contato público</h2>
        <div className="space-y-3">
          <Field label="E-mail">
            <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="WhatsApp">
            <input className={inputClass} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </Field>
          <Field label="Endereço">
            <textarea
              className={inputClass}
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Field>
          <button type="button" className={btnPrimary} onClick={() => void saveContact()}>
            <Save className="h-4 w-4" /> Salvar contatos
          </button>
        </div>
      </AdminCard>

      <AdminCard className="mt-4 max-w-2xl">
        <h2 className="mb-2 font-semibold text-slate-900">Instituição</h2>
        <p className="text-sm text-slate-600">
          <strong>{site.name}</strong>
          <br />
          CNPJ {site.cnpj}
          <br />
          {site.affiliation}
          <br />
          Fundada em {site.foundedDisplay}
        </p>
        <p className="mt-3 text-xs text-slate-400">
          Configurações internas carregadas: {settings.length}
        </p>
      </AdminCard>
    </div>
  );
}
