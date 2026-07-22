import { Mail, MapPin, Phone } from "lucide-react";
import { contact } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";

export function ContactTeaser() {
  return (
    <section className="section-pad bg-white">
      <div className="container-site grid gap-10 lg:grid-cols-2 lg:items-center">
        <SectionHeading
          align="left"
          eyebrow="Contato"
          title="Fale com a gente"
          description="Estamos no Mauazinho, em Manaus. Entre em contato por e-mail, WhatsApp ou formulário."
        />
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
          <ul className="space-y-5 text-sm md:text-base">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <span className="text-slate-700">{contact.fullAddress}</span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <a
                className="text-slate-700 hover:text-brand break-all"
                href={`mailto:${contact.email}`}
              >
                {contact.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <a
                className="text-slate-700 hover:text-brand"
                href={contact.whatsappUrl}
              >
                WhatsApp {contact.whatsappDisplay}
              </a>
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contato">Enviar mensagem</ButtonLink>
            <ButtonLink href={contact.whatsappUrl} variant="outline" external>
              Abrir WhatsApp
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
