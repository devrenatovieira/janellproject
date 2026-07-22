import type { Metadata } from "next";
import { about, site } from "@/content/site";
import { PageHero } from "@/components/shared/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { PadrinhoPanel } from "@/components/godparent/padrinho-panel";

export const metadata: Metadata = {
  title: "Área do Padrinho",
  description: `Consulte o histórico de doações e saiba como ser padrinho financeiro do ${site.name}.`,
};

export default function PadrinhoPage() {
  return (
    <>
      <PageHero
        eyebrow="Apoio contínuo"
        title="Área do Padrinho"
        description="Padrinhos financeiros tornam possível o cuidado diário das crianças e adolescentes atendidos pelo Lar."
      />
      <section className="section-pad">
        <div className="container-site max-w-3xl space-y-10">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold text-slate-900">
              O que é ser padrinho?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-[15px]">
              {about.howWeLive}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/doacao" variant="accent">
                Quero ser padrinho / doar
              </ButtonLink>
              <ButtonLink href="/contato" variant="outline">
                Falar com a instituição
              </ButtonLink>
            </div>
          </div>

          <PadrinhoPanel />
        </div>
      </section>
    </>
  );
}
