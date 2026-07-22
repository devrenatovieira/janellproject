import type { Metadata } from "next";
import Image from "next/image";
import { getService, contact } from "@/content/site";
import { PageHero } from "@/components/shared/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { FosterForm } from "@/components/foster/foster-form";
import { Check } from "lucide-react";

const service = getService("familia-acolhedora")!;

export const metadata: Metadata = {
  title: "Família Acolhedora",
  description: service.short,
};

export default function FamiliaAcolhedoraPage() {
  return (
    <>
      <PageHero
        eyebrow="Acolhimento Familiar"
        title="Família Acolhedora"
        description={service.tagline}
      />
      <section className="section-pad">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
            <Image
              src="/images/brand/familia-acolhedora.png"
              alt="Capacitação Família Acolhedora"
              width={800}
              height={1000}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="space-y-5 text-base leading-relaxed text-slate-700">
            {service.full!.split("\n\n").map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            <blockquote className="border-l-4 border-rose-400 bg-rose-50 px-5 py-4 text-lg font-medium text-rose-900">
              “{service.tagline}”
            </blockquote>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Critérios para cadastro
            </h2>
            <ul className="mt-6 space-y-3">
              {service.criteria!.map((c) => (
                <li key={c} className="flex gap-3 text-sm text-slate-700 md:text-[15px]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Documentos necessários
            </h2>
            <ul className="mt-6 space-y-3">
              {service.documents!.map((d) => (
                <li
                  key={d}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800"
                >
                  {d}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#inscricao" variant="accent">
                Preencher inscrição
              </ButtonLink>
              <ButtonLink href={contact.whatsappUrl} variant="outline" external>
                WhatsApp
              </ButtonLink>
              <ButtonLink href="/doacao" variant="ghost">
                Apoiar o serviço
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site max-w-3xl">
          <FosterForm />
        </div>
      </section>
    </>
  );
}
