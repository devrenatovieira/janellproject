import type { Metadata } from "next";
import { contact, site } from "@/content/site";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
  title: "Privacidade",
  description: "Política de privacidade e LGPD — Lar Batista Janell Doyle.",
};

export default function PrivacidadePage() {
  return (
    <>
      <PageHero eyebrow="LGPD" title="Política de Privacidade" />
      <section className="section-pad">
        <div className="container-site prose prose-slate max-w-3xl text-sm leading-relaxed text-slate-700">
          <p>
            O {site.name} trata dados pessoais com base na Lei Geral de Proteção
            de Dados (LGPD). Dados de contato e formulários são usados para
            atendimento e comunicação institucional.
          </p>
          <p className="mt-4">
            Para exercer direitos do titular, escreva para{" "}
            <a className="text-brand underline" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            .
          </p>
          <p className="mt-4 text-sm text-slate-600">
            Em caso de dúvidas sobre o tratamento de dados, entre em contato
            pelos canais oficiais da instituição.
          </p>
        </div>
      </section>
    </>
  );
}
