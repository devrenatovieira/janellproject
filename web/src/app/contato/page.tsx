import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { contact, site } from "@/content/site";
import { brand } from "@/content/media";
import { PageHero } from "@/components/shared/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com o ${site.name} — ${contact.fullAddress}`,
};

export default function ContatoPage() {
  return (
    <>
      <PageHero
        eyebrow="Fale conosco"
        title="Entre em contato"
        description={`Estamos no Mauazinho, em Manaus. O ${site.name} responde por e-mail e WhatsApp.`}
      />
      <section className="section-pad">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <span className="relative h-12 w-12 overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200">
                  <Image
                    src={brand.logo}
                    alt={`Logo ${site.name}`}
                    fill
                    className="object-contain p-1"
                    sizes="48px"
                  />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{site.name}</p>
                  <p className="text-xs text-muted">OSC · Manaus/AM</p>
                </div>
              </div>
              <ul className="space-y-5">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-brand" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Endereço
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {contact.fullAddress}
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-brand" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">E-mail</p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="mt-1 block break-all text-sm text-brand hover:underline"
                    >
                      {contact.email}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-brand" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      WhatsApp
                    </p>
                    <a
                      href={contact.whatsappUrl}
                      className="mt-1 block text-sm text-brand hover:underline"
                    >
                      {contact.whatsappDisplay}
                    </a>
                  </div>
                </li>
              </ul>
              <div className="mt-6">
                <ButtonLink href={contact.whatsappUrl} external>
                  Conversar no WhatsApp
                </ButtonLink>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
