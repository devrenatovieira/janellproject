import type { Metadata } from "next";
import { adoption, contact } from "@/content/site";
import { PageHero } from "@/components/shared/page-hero";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Adoção",
  description:
    "Informações oficiais sobre quem pode ser adotado, conforme conteúdo do site do Lar Batista Janell Doyle.",
};

export default function AdocaoPage() {
  return (
    <>
      <PageHero
        eyebrow="Informativo"
        title="Adoção"
        description="Informações institucionais sobre adoção e proteção de crianças e adolescentes."
      />
      <section className="section-pad">
        <div className="container-site max-w-3xl">
          <h2 className="text-2xl font-semibold text-slate-900">
            Quem pode ser adotado?
          </h2>
          <ol className="mt-6 space-y-4">
            {adoption.whoCanBeAdopted.map((item, i) => (
              <li
                key={item}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand">
                  {String.fromCharCode(97 + i)})
                </span>
                <p className="text-sm leading-relaxed text-slate-700 md:text-[15px]">
                  {item}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm leading-relaxed text-slate-700">
            <h3 className="font-semibold text-slate-900">Orientação</h3>
            <p className="mt-2">
              O processo de adoção segue a legislação brasileira (ECA e Código
              Civil) e o Cadastro Nacional de Adoção. Para informações e
              encaminhamentos, entre em contato com o Lar Batista Janell Doyle.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={contact.whatsappUrl} external>
              Falar conosco
            </ButtonLink>
            <ButtonLink href="/familia-acolhedora" variant="outline">
              Família Acolhedora
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
