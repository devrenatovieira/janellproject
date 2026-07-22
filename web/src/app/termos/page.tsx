import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: `Termos de uso do site do ${site.name}.`,
};

export default function TermosPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Termos de Uso" />
      <section className="section-pad">
        <div className="container-site max-w-3xl text-sm leading-relaxed text-slate-700">
          <p>
            Ao utilizar este site, você concorda com as condições de uso do{" "}
            {site.name}. O conteúdo institucional é de propriedade da
            organização. Informações de doação e contatos são as oficiais
            publicadas pela instituição.
          </p>
          <p className="mt-4 text-sm text-slate-600">
            Dúvidas sobre o uso deste site podem ser encaminhadas pelos canais
            de contato oficiais da instituição.
          </p>
        </div>
      </section>
    </>
  );
}
